//! 视频搜索 API 实现
//!
//! 支持 Bilibili、腾讯视频等平台搜索

use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::{ApiError, SearchResult};

/// 视频信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Video {
    /// 视频 ID
    pub id: String,
    /// 标题
    pub title: String,
    /// 时长（秒）
    pub duration: u32,
    /// 播放 URL
    pub url: String,
    /// 封面图片
    pub cover: String,
    /// 数据源
    pub source: String,
    /// 播放量
    pub play_count: u64,
    /// UP主/作者
    pub author: String,
}

/// 支持的视频源
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoSource {
    pub id: String,
    pub name: String,
    pub icon: String,
}

/// Bilibili 搜索响应结构
#[derive(Debug, Deserialize)]
struct BilibiliSearchResponse {
    code: i32,
    data: Option<BilibiliSearchData>,
    message: Option<String>,
}

#[derive(Debug, Deserialize)]
struct BilibiliSearchData {
    result: Option<Vec<BilibiliVideo>>,
    numResults: Option<u64>,
}

#[derive(Debug, Deserialize)]
struct BilibiliVideo {
    #[serde(rename = "bvid")]
    bvid: Option<String>,
    #[serde(rename = "aid")]
    aid: Option<i64>,
    title: Option<String>,
    duration: Option<String>,
    pic: Option<String>,
    play: Option<i64>,
    author: Option<String>,
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

/// 获取支持的视频源列表
#[tauri::command]
pub async fn get_video_source() -> Vec<VideoSource> {
    vec![
        VideoSource {
            id: "bilibili".to_string(),
            name: "哔哩哔哩".to_string(),
            icon: "bilibili".to_string(),
        },
        VideoSource {
            id: "tencent".to_string(),
            name: "腾讯视频".to_string(),
            icon: "tencent".to_string(),
        },
        VideoSource {
            id: "mock".to_string(),
            name: "测试数据".to_string(),
            icon: "mock".to_string(),
        },
    ]
}

/// 搜索视频
///
/// # 参数
/// - `keyword`: 搜索关键词
/// - `source`: 数据源 (bilibili, tencent, mock)
/// - `page`: 页码
/// - `page_size`: 每页数量
#[tauri::command]
pub async fn search_video(
    keyword: String,
    source: String,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Video>, String> {
    tracing::info!("搜索视频: keyword={}, source={}, page={}", keyword, source, page);

    let client = HTTP_CLIENT.clone();

    let result = match source.as_str() {
        "bilibili" => search_bilibili(&client, &keyword, page, page_size).await,
        "tencent" => search_tencent(&client, &keyword, page, page_size).await,
        "mock" => Ok(mock_video_search(&keyword, page, page_size)),
        _ => return Err(format!("不支持的视频源: {}", source)),
    };

    result.map_err(|e: ApiError| e.to_string())
}

/// Bilibili 视频搜索（真实 API）
async fn search_bilibili(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Video>, ApiError> {
    tracing::info!("Bilibili搜索: {}", keyword);

    // 构建请求 URL
    let url = format!(
        "https://api.bilibili.com/x/web-interface/search/type?keyword={}&search_type=video&page={}&page_size={}",
        urlencoding::encode(keyword),
        page,
        page_size
    );

    // 发送请求
    let response = client
        .get(&url)
        .header("Referer", "https://www.bilibili.com")
        .header("Accept", "application/json")
        .send()
        .await?;

    // 检查响应状态
    if !response.status().is_success() {
        return Err(ApiError::Network(format!(
            "Bilibili API 返回错误状态: {}",
            response.status()
        )));
    }

    // 解析响应
    let search_result: BilibiliSearchResponse = response.json().await?;

    // 检查 API 响应码
    if search_result.code != 0 {
        return Err(ApiError::Network(format!(
            "Bilibili API 返回错误: {}",
            search_result.message.unwrap_or_else(|| "未知错误".to_string())
        )));
    }

    // 提取视频列表
    let data = match search_result.data {
        Some(d) => d,
        None => return Ok(SearchResult::empty("bilibili")),
    };

    let videos = match data.result {
        Some(v) => v,
        None => return Ok(SearchResult::empty("bilibili")),
    };

    let total = data.numResults.unwrap_or(videos.len() as u64);

    // 转换为 Video
    let mut video_list: Vec<Video> = Vec::new();
    for v in videos {
        // 获取视频 ID（优先使用 bvid，否则使用 aid）
        let id = v.bvid.clone().unwrap_or_else(|| {
            v.aid.map(|aid| format!("av{}", aid)).unwrap_or_default()
        });

        if id.is_empty() {
            continue;
        }

        // 解析时长（格式：MM:SS 或 HH:MM:SS）
        let duration = parse_duration(v.duration.as_deref().unwrap_or("0:00"));

        // 清理标题（Bilibili 返回的标题包含 <em class="keyword"> 标签）
        let title = clean_title(v.title.as_deref().unwrap_or("未知标题"));

        // 获取真实的视频播放 URL
        let play_url = get_video_play_url(client, &id).await.unwrap_or_else(|_| {
            format!("https://www.bilibili.com/video/{}", id)
        });

        video_list.push(Video {
            id: id.clone(),
            title,
            duration,
            url: play_url,
            cover: v.pic.unwrap_or_else(|| "https://picsum.photos/320/180".to_string()),
            source: "bilibili".to_string(),
            play_count: v.play.unwrap_or(0) as u64,
            author: v.author.unwrap_or_else(|| "未知UP主".to_string()),
        });
    }

    Ok(SearchResult::new(video_list, total as u32, page, page_size, "bilibili"))
}

/// 获取视频播放 URL
async fn get_video_play_url(client: &Client, video_id: &str) -> Result<String, ApiError> {
    // B站视频需要使用专门的 API 获取播放 URL，这通常需要处理复杂的加密
    // 这里我们返回视频页面 URL，实际播放需要在前端处理
    // 由于版权保护，B站不会直接提供视频源 URL
    Ok(format!("https://www.bilibili.com/video/{}", video_id))
}

/// 解析时长字符串（格式：MM:SS 或 HH:MM:SS）
fn parse_duration(duration_str: &str) -> u32 {
    let parts: Vec<&str> = duration_str.split(':').collect();
    match parts.len() {
        2 => {
            // MM:SS 格式
            let minutes: u32 = parts[0].parse().unwrap_or(0);
            let seconds: u32 = parts[1].parse().unwrap_or(0);
            minutes * 60 + seconds
        }
        3 => {
            // HH:MM:SS 格式
            let hours: u32 = parts[0].parse().unwrap_or(0);
            let minutes: u32 = parts[1].parse().unwrap_or(0);
            let seconds: u32 = parts[2].parse().unwrap_or(0);
            hours * 3600 + minutes * 60 + seconds
        }
        _ => 0,
    }
}

/// 清理标题（移除 HTML 标签）
fn clean_title(title: &str) -> String {
    // 移除 <em class="keyword"> 和 </em> 标签
    title
        .replace("<em class=\"keyword\">", "")
        .replace("</em>", "")
        .replace("<em class='keyword'>", "")
}

/// 腾讯视频搜索
async fn search_tencent(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Video>, ApiError> {
    // TODO: 实现真实的腾讯视频 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("腾讯视频搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_video_search(keyword, page, page_size))
}

/// 生成模拟视频数据
fn mock_video_search(keyword: &str, page: i32, page_size: i32) -> SearchResult<Video> {
    let start = (page - 1) * page_size;
    let videos: Vec<Video> = (0..page_size)
        .map(|i| {
            let idx = start + i;
            Video {
                id: format!("video_{}", idx),
                title: format!("{} - 视频 {}", keyword, idx + 1),
                duration: 600 + (idx as u32 * 30) % 600,
                url: format!("https://example.com/video/{}", idx),
                cover: "https://picsum.photos/320/180".to_string(),
                source: "mock".to_string(),
                play_count: 10000 + (idx as u64 * 1000),
                author: "模拟UP主".to_string(),
            }
        })
        .collect();

    SearchResult::new(videos, 50, page, page_size, "mock")
}