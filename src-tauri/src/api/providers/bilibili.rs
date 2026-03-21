//! Bilibili 视频 API 实现
//! 
//! 使用公开 API 进行视频搜索

use crate::api::Video;
use serde::{Deserialize, Serialize};
use super::create_client;

/// Bilibili 搜索响应
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BilibiliSearchResponse {
    pub data: Option<BilibiliData>,
    pub code: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BilibiliData {
    pub result: Option<Vec<BilibiliVideo>>,
    pub numResults: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BilibiliVideo {
    #[serde(alias = "bvid")]
    pub id: String,
    #[serde(alias = "title")]
    pub name: String,
    #[serde(default)]
    pub author: Option<String>,
    #[serde(default)]
    pub duration: Option<String>,
    #[serde(default, alias = "pic")]
    pub cover: Option<String>,
    #[serde(default)]
    pub play: Option<u32>,
    #[serde(default)]
    pub description: Option<String>,
}

/// 搜索 Bilibili 视频
pub async fn search_bilibili(query: &str, limit: u32) -> Result<Vec<Video>, String> {
    let client = create_client();
    
    // Bilibili 搜索 API
    let url = format!(
        "https://api.bilibili.com/x/web-interface/search/type?keyword={}&search_type=video&page=1&page_size={}",
        urlencoding::encode(query),
        limit
    );
    
    tracing::info!("Searching Bilibili: {}", query);
    
    match client
        .get(&url)
        .header("Referer", "https://www.bilibili.com")
        .send()
        .await
    {
        Ok(response) => {
            match response.json::<BilibiliSearchResponse>().await {
                Ok(data) => {
                    if data.code != 0 {
                        return Err(format!("API error: {}", data.code));
                    }
                    
                    let videos = data.data
                        .and_then(|d| d.result)
                        .unwrap_or_default();
                    
                    let results: Vec<Video> = videos
                        .into_iter()
                        .map(|v| Video {
                            id: format!("bilibili_{}", v.id),
                            title: v.name
                                .replace("<em class=\"keyword\">", "")
                                .replace("</em>", ""),
                            duration: parse_duration(&v.duration.unwrap_or_else(|| "0:00".to_string())),
                            url: format!("https://www.bilibili.com/video/{}", v.id),
                            cover: v.cover.unwrap_or_else(|| "".to_string())
                                .replace("http://", "https://"),
                            source: "bilibili".to_string(),
                        })
                        .collect();
                    
                    Ok(results)
                }
                Err(e) => Err(format!("Parse error: {}", e))
            }
        }
        Err(e) => Err(format!("Request error: {}", e))
    }
}

/// 解析时长字符串 "MM:SS" 或 "HH:MM:SS" 为秒
fn parse_duration(s: &str) -> u32 {
    let parts: Vec<&str> = s.split(':').collect();
    match parts.len() {
        2 => {
            let mins: u32 = parts[0].parse().unwrap_or(0);
            let secs: u32 = parts[1].parse().unwrap_or(0);
            mins * 60 + secs
        }
        3 => {
            let hours: u32 = parts[0].parse().unwrap_or(0);
            let mins: u32 = parts[1].parse().unwrap_or(0);
            let secs: u32 = parts[2].parse().unwrap_or(0);
            hours * 3600 + mins * 60 + secs
        }
        _ => 0
    }
}

/// 获取视频详情
pub async fn get_video_info(bvid: &str) -> Result<BilibiliVideo, String> {
    let client = create_client();
    let url = format!("https://api.bilibili.com/x/web-interface/view?bvid={}", bvid);
    
    #[derive(Deserialize)]
    struct VideoResponse {
        data: BilibiliVideoData,
    }
    
    #[derive(Deserialize)]
    struct BilibiliVideoData {
        bvid: String,
        title: String,
        #[serde(default)]
        owner: Option<BilibiliOwner>,
        #[serde(default)]
        duration: u32,
        #[serde(default)]
        pic: Option<String>,
        #[serde(default)]
        desc: Option<String>,
    }
    
    #[derive(Deserialize)]
    struct BilibiliOwner {
        #[serde(default)]
        name: Option<String>,
    }
    
    match client
        .get(&url)
        .header("Referer", "https://www.bilibili.com")
        .send()
        .await
    {
        Ok(response) => {
            match response.json::<VideoResponse>().await {
                Ok(data) => Ok(BilibiliVideo {
                    id: data.data.bvid,
                    name: data.data.title,
                    author: data.data.owner.and_then(|o| o.name),
                    duration: Some(format_duration(data.data.duration)),
                    cover: data.data.pic,
                    play: None,
                    description: data.data.desc,
                }),
                Err(e) => Err(format!("Parse error: {}", e))
            }
        }
        Err(e) => Err(format!("Request error: {}", e))
    }
}

/// 格式化秒数为 "MM:SS"
fn format_duration(secs: u32) -> String {
    let mins = secs / 60;
    let s = secs % 60;
    format!("{}:{:02}", mins, s)
}