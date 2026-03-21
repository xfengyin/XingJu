//! 网易云音乐 API 实现
//! 
//! 使用公开 API 进行音乐搜索

use crate::api::{MusicTrack, ApiResponse};
use serde::{Deserialize, Serialize};
use super::{create_client, SearchResult};

/// 网易云音乐搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeteaseSearchResponse {
    pub result: Option<NeteaseResult>,
    pub code: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeteaseResult {
    pub songs: Option<Vec<NeteaseSong>>,
    pub songCount: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeteaseSong {
    pub id: i64,
    pub name: String,
    pub artists: Vec<NeteaseArtist>,
    pub album: NeteaseAlbum,
    pub duration: i64,
    pub mvid: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeteaseArtist {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeteaseAlbum {
    pub id: i64,
    pub name: String,
    #[serde(default)]
    pub picUrl: Option<String>,
}

/// 搜索网易云音乐
pub async fn search_netease(query: &str, limit: u32) -> ApiResponse<Vec<MusicTrack>> {
    let client = create_client();
    
    // 使用公开的搜索 API
    let url = format!(
        "https://music.163.com/api/search/get/web?s={}&type=1&limit={}&offset=0",
        urlencoding::encode(query),
        limit
    );
    
    tracing::info!("Searching Netease Music: {}", query);
    
    match client.get(&url).send().await {
        Ok(response) => {
            match response.json::<NeteaseSearchResponse>().await {
                Ok(data) => {
                    if data.code != 200 {
                        return ApiResponse::error(format!("API error: {}", data.code));
                    }
                    
                    let songs = data.result
                        .and_then(|r| r.songs)
                        .unwrap_or_default();
                    
                    let tracks: Vec<MusicTrack> = songs
                        .into_iter()
                        .map(|song| MusicTrack {
                            id: format!("netease_{}", song.id),
                            title: song.name,
                            artist: song.artists.iter()
                                .map(|a| a.name.clone())
                                .collect::<Vec<_>>()
                                .join("/"),
                            album: song.album.name,
                            duration: (song.duration / 1000) as u32,
                            url: format!("https://music.163.com/#/song?id={}", song.id),
                            cover: song.album.picUrl.unwrap_or_else(|| "".to_string()),
                            source: "netease".to_string(),
                        })
                        .collect();
                    
                    ApiResponse::success(tracks)
                }
                Err(e) => ApiResponse::error(format!("Parse error: {}", e))
            }
        }
        Err(e) => ApiResponse::error(format!("Request error: {}", e))
    }
}

/// 获取歌曲详情
pub async fn get_song_detail(id: i64) -> Result<NeteaseSong, String> {
    let client = create_client();
    let url = format!("https://music.163.com/api/song/detail?ids=[{}]", id);
    
    #[derive(Deserialize)]
    struct DetailResponse {
        songs: Vec<NeteaseSong>,
    }
    
    match client.get(&url).send().await {
        Ok(response) => {
            match response.json::<DetailResponse>().await {
                Ok(data) => {
                    data.songs.into_iter().next()
                        .ok_or_else(|| "Song not found".to_string())
                }
                Err(e) => Err(format!("Parse error: {}", e))
            }
        }
        Err(e) => Err(format!("Request error: {}", e))
    }
}

/// 获取歌曲播放 URL（需要 VIP 或特殊处理）
pub async fn get_song_url(id: i64) -> Result<String, String> {
    // 注意：网易云音乐的播放 URL 需要登录或 VIP
    // 这里返回一个播放页面的 URL 作为占位
    Ok(format!("https://music.163.com/#/song?id={}", id))
}