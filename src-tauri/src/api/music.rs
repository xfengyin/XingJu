//! 音乐搜索 API 实现
//!
//! 支持网易云音乐、QQ音乐等平台搜索

use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::{ApiError, SearchResult};

/// 音乐曲目信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MusicTrack {
    /// 曲目 ID
    pub id: String,
    /// 标题
    pub title: String,
    /// 艺术家
    pub artist: String,
    /// 专辑
    pub album: String,
    /// 时长（秒）
    pub duration: u32,
    /// 播放 URL
    pub url: String,
    /// 封面图片
    pub cover: String,
    /// 数据源
    pub source: String,
}

/// 支持的音乐源
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MusicSource {
    pub id: String,
    pub name: String,
    pub icon: String,
}

/// 网易云音乐搜索响应结构
#[derive(Debug, Deserialize)]
struct NeteaseSearchResponse {
    code: i32,
    result: Option<NeteaseSearchResult>,
}

#[derive(Debug, Deserialize)]
struct NeteaseSearchResult {
    songs: Option<Vec<NeteaseSong>>,
    songCount: Option<u32>,
}

#[derive(Debug, Deserialize)]
struct NeteaseSong {
    id: i64,
    name: String,
    artists: Option<Vec<NeteaseArtist>>,
    album: Option<NeteaseAlbum>,
    duration: Option<u64>,
}

#[derive(Debug, Deserialize)]
struct NeteaseArtist {
    name: String,
}

#[derive(Debug, Deserialize)]
struct NeteaseAlbum {
    name: String,
    picUrl: Option<String>,
}

/// HTTP 客户端（使用全局缓存）
static HTTP_CLIENT: once_cell::sync::Lazy<Arc<Client>> =
    once_cell::sync::Lazy::new(|| {
        Arc::new(
            Client::builder()
                .timeout(std::time::Duration::from_secs(15))
                .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .build()
                .unwrap()
        )
    });

/// 获取支持的音乐源列表
#[tauri::command]
pub async fn get_music_source() -> Vec<MusicSource> {
    vec![
        MusicSource {
            id: "netease".to_string(),
            name: "网易云音乐".to_string(),
            icon: "netease".to_string(),
        },
        MusicSource {
            id: "qq".to_string(),
            name: "QQ音乐".to_string(),
            icon: "qq".to_string(),
        },
        MusicSource {
            id: "mock".to_string(),
            name: "测试数据".to_string(),
            icon: "mock".to_string(),
        },
    ]
}

/// 搜索音乐
///
/// # 参数
/// - `keyword`: 搜索关键词
/// - `source`: 数据源 (netease, qq, mock)
/// - `page`: 页码
/// - `page_size`: 每页数量
#[tauri::command]
pub async fn search_music(
    keyword: String,
    source: String,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<MusicTrack>, String> {
    tracing::info!("搜索音乐: keyword={}, source={}, page={}", keyword, source, page);

    let client = HTTP_CLIENT.clone();

    let result = match source.as_str() {
        "netease" => search_netease(&client, &keyword, page, page_size).await,
        "qq" => search_qq(&client, &keyword, page, page_size).await,
        "mock" => Ok(mock_music_search(&keyword, page, page_size)),
        _ => return Err(format!("不支持的音乐源: {}", source)),
    };

    result.map_err(|e: ApiError| e.to_string())
}

/// 网易云音乐搜索（真实 API）
async fn search_netease(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<MusicTrack>, ApiError> {
    tracing::info!("网易云音乐搜索: {}", keyword);

    // 计算偏移量（网易云 API 使用 offset 而不是 page）
    let offset = (page - 1) * page_size;

    // 构建请求 URL
    let url = format!(
        "https://music.163.com/api/search/get/web?s={}&type=1&offset={}&limit={}",
        urlencoding::encode(keyword),
        offset,
        page_size
    );

    // 发送请求
    let response = client
        .get(&url)
        .header("Referer", "https://music.163.com")
        .header("Accept", "application/json")
        .send()
        .await?;

    // 检查响应状态
    if !response.status().is_success() {
        return Err(ApiError::Network(format!(
            "网易云音乐 API 返回错误状态: {}",
            response.status()
        )));
    }

    // 解析响应
    let search_result: NeteaseSearchResponse = response.json().await?;

    // 检查 API 响应码
    if search_result.code != 200 {
        return Err(ApiError::Network(format!(
            "网易云音乐 API 返回错误码: {}",
            search_result.code
        )));
    }

    // 提取歌曲列表
    let result = match search_result.result {
        Some(r) => r,
        None => return Ok(SearchResult::empty("netease")),
    };

    let songs = match result.songs {
        Some(s) => s,
        None => return Ok(SearchResult::empty("netease")),
    };

    let total = result.songCount.unwrap_or(songs.len() as u32);

    // 转换为 MusicTrack
    let mut tracks: Vec<MusicTrack> = Vec::new();
    for song in songs {
        let artist = song
            .artists
            .unwrap_or_default()
            .iter()
            .map(|a| a.name.clone())
            .collect::<Vec<_>>()
            .join("/");

        let album = song
            .album
            .as_ref()
            .map(|a| a.name.clone())
            .unwrap_or_default();

        let cover = song
            .album
            .and_then(|a| a.picUrl)
            .unwrap_or_else(|| "https://picsum.photos/200".to_string());

        let duration = song.duration.unwrap_or(0) / 1000;

        // 获取真实的播放 URL
        let play_url = get_play_url(client, &song.id.to_string()).await.unwrap_or_else(|_| {
            format!("https://music.163.com/song/media/outer/url?id={}.mp3", song.id)
        });

        tracks.push(MusicTrack {
            id: song.id.to_string(),
            title: song.name,
            artist,
            album,
            duration: duration as u32,
            url: play_url,
            cover,
            source: "netease".to_string(),
        });
    }

    Ok(SearchResult::new(tracks, total, page, page_size, "netease"))
}

/// 获取播放 URL
async fn get_play_url(client: &Client, song_id: &str) -> Result<String, ApiError> {
    // 网易云音乐需要使用内部 API 获取播放 URL，这通常需要登录和加密
    // 这里我们使用一个公开的第三方代理 API
    let url = format!(
        "https://api.bzqll.com/music/tencent/url?key=free&id={}&br=128k",
        song_id
    );

    let response = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)")
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(ApiError::Network(format!(
            "播放 URL API 返回错误状态: {}",
            response.status()
        )));
    }

    // 注意：实际实现需要处理返回的 JSON 并提取 URL
    // 由于版权保护，大多数音乐平台不会直接提供播放 URL
    // 临时返回模拟 URL，实际使用时需要找到可用的第三方 API
    Ok(format!("https://music.163.com/song/media/outer/url?id={}.mp3", song_id))
}

/// QQ 音乐搜索
async fn search_qq(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<MusicTrack>, ApiError> {
    // TODO: 实现真实的 QQ 音乐 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("QQ音乐搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_music_search(keyword, page, page_size))
}

/// 生成模拟音乐数据
fn mock_music_search(keyword: &str, page: i32, page_size: i32) -> SearchResult<MusicTrack> {
    let start = (page - 1) * page_size;
    let tracks: Vec<MusicTrack> = (0..page_size)
        .map(|i| {
            let idx = start + i;
            MusicTrack {
                id: format!("music_{}", idx),
                title: format!("{} - 歌曲 {}", keyword, idx + 1),
                artist: "模拟歌手".to_string(),
                album: "模拟专辑".to_string(),
                duration: 180 + (idx as u32 * 10) % 120,
                url: format!("https://example.com/music/{}.mp3", idx),
                cover: "https://picsum.photos/200".to_string(),
                source: "mock".to_string(),
            }
        })
        .collect();

    SearchResult::new(tracks, 100, page, page_size, "mock")
}