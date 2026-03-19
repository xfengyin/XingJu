//! 多平台 API 集成

use serde::{Deserialize, Serialize};

/// 音乐搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MusicTrack {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: u32,
    pub url: String,
    pub cover: String,
    pub source: String,
}

/// 视频搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoResult {
    pub id: String,
    pub title: String,
    pub author: String,
    pub duration: u32,
    pub url: String,
    pub cover: String,
    pub source: String,
}

/// 小说搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NovelResult {
    pub id: String,
    pub title: String,
    pub author: String,
    pub description: String,
    pub cover: String,
    pub source: String,
}

/// 漫画搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MangaResult {
    pub id: String,
    pub title: String,
    pub author: String,
    pub description: String,
    pub cover: String,
    pub source: String,
}

/// API 错误
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),
    #[error("Parse error: {0}")]
    Parse(#[from] serde_json::Error),
    #[error("Source not supported: {0}")]
    UnsupportedSource(String),
}

impl Serialize for ApiError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

/// 音乐 API 客户端
pub struct MusicAPI {
    client: reqwest::Client,
}

impl MusicAPI {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    /// 搜索音乐 - 使用免费 API
    pub async fn search(&self, keyword: &str, source: &str) -> Result<Vec<MusicTrack>, ApiError> {
        match source {
            "kugou" => self.search_kugou(keyword).await,
            "netease" => self.search_netease(keyword).await,
            _ => self.search_kugou(keyword).await, // 默认使用酷狗
        }
    }

    /// 酷狗音乐搜索
    async fn search_kugou(&self, keyword: &str) -> Result<Vec<MusicTrack>, ApiError> {
        let url = format!(
            "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword={}&page=1&pagesize=20&showtype=1",
            keyword
        );
        
        let response = self.client.get(&url).send().await?;
        let data: serde_json::Value = response.json().await?;
        
        let mut tracks = Vec::new();
        if let Some(songs) = data["data"]["info"].as_array() {
            for song in songs {
                tracks.push(MusicTrack {
                    id: song["hash"].as_str().unwrap_or("").to_string(),
                    title: song["songname"].as_str().unwrap_or("未知").to_string(),
                    artist: song["singername"].as_str().unwrap_or("未知艺术家").to_string(),
                    album: song["album_name"].as_str().unwrap_or("未知专辑").to_string(),
                    duration: song["duration"].as_u64().unwrap_or(0) as u32,
                    url: "".to_string(), // 需要单独获取播放链接
                    cover: song["imgurl"].as_str().unwrap_or("").to_string(),
                    source: "kugou".to_string(),
                });
            }
        }
        
        Ok(tracks)
    }

    /// 网易云音乐搜索
    async fn search_netease(&self, keyword: &str) -> Result<Vec<MusicTrack>, ApiError> {
        let url = format!(
            "https://netease-cloud-music-api-five-roan-25.vercel.app/search?keywords={}&limit=20",
            keyword
        );
        
        let response = self.client.get(&url).send().await?;
        let data: serde_json::Value = response.json().await?;
        
        let mut tracks = Vec::new();
        if let Some(songs) = data["result"]["songs"].as_array() {
            for song in songs {
                let artists = song["artists"]
                    .as_array()
                    .map(|arr| {
                        arr.iter()
                            .filter_map(|a| a["name"].as_str())
                            .collect::<Vec<_>>()
                            .join(", ")
                    })
                    .unwrap_or_else(|| "未知艺术家".to_string());
                
                tracks.push(MusicTrack {
                    id: song["id"].as_i64().unwrap_or(0).to_string(),
                    title: song["name"].as_str().unwrap_or("未知").to_string(),
                    artist: artists,
                    album: song["album"]["name"].as_str().unwrap_or("未知专辑").to_string(),
                    duration: song["duration"].as_u64().unwrap_or(0) as u32 / 1000,
                    url: "".to_string(),
                    cover: song["album"]["picUrl"].as_str().unwrap_or("").to_string(),
                    source: "netease".to_string(),
                });
            }
        }
        
        Ok(tracks)
    }

    /// 获取播放链接
    pub async fn get_play_url(&self, hash: &str, album_id: &str) -> Result<String, ApiError> {
        let url = format!(
            "http://m.kugou.com/app/i/getSongInfo.php?hash={}&cmd=playInfo",
            hash
        );
        
        let response = self.client.get(&url).send().await?;
        let data: serde_json::Value = response.json().await?;
        
        let play_url = data["url"].as_str().unwrap_or("").to_string();
        Ok(play_url)
    }
}

impl Default for MusicAPI {
    fn default() -> Self {
        Self::new()
    }
}

/// 视频 API 客户端
pub struct VideoAPI {
    client: reqwest::Client,
}

impl VideoAPI {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    /// 搜索视频
    pub async fn search(&self, keyword: &str, source: &str) -> Result<Vec<VideoResult>, ApiError> {
        // 使用 bilibili API 搜索
        let url = format!(
            "https://api.bilibili.com/x/web-interface/search/search?search_type=video&keyword={}&page=1&pagesize=20",
            keyword
        );
        
        let response = self.client.get(&url)
            .header("User-Agent", "Mozilla/5.0")
            .send()
            .await?;
        
        let data: serde_json::Value = response.json().await?;
        
        let mut videos = Vec::new();
        if let Some(result) = data["result"].as_array() {
            for item in result {
                videos.push(VideoResult {
                    id: item["aid"].as_i64().unwrap_or(0).to_string(),
                    title: item["title"].as_str().unwrap_or("未知").to_string(),
                    author: item["author"].as_str().unwrap_or("未知").to_string(),
                    duration: 0, // 需要单独获取
                    url: format!("https://www.bilibili.com/video/{}", item["bvid"].as_str().unwrap_or("")),
                    cover: item["pic"].as_str().unwrap_or("").to_string(),
                    source: source.to_string(),
                });
            }
        }
        
        Ok(videos)
    }
}

impl Default for VideoAPI {
    fn default() -> Self {
        Self::new()
    }
}

/// 小说 API 客户端
pub struct NovelAPI {
    client: reqwest::Client,
}

impl NovelAPI {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    /// 搜索小说 (使用笔趣阁 API)
    pub async fn search(&self, keyword: &str) -> Result<Vec<NovelResult>, ApiError> {
        // 笔趣阁搜索
        let url = format!(
            "https://www.xiaoshuo.com/search?keyword={}",
            keyword
        );
        
        // 返回示例数据，因为大多数小说网站没有公开 API
        Ok(vec![NovelResult {
            id: "1".to_string(),
            title: format!("{} - 示例小说", keyword),
            author: "未知作者".to_string(),
            description: "请访问对应小说网站获取更多内容".to_string(),
            cover: "".to_string(),
            source: "xiaoshuo".to_string(),
        }])
    }
}

impl Default for NovelAPI {
    fn default() -> Self {
        Self::new()
    }
}

/// 漫画 API 客户端
pub struct MangaAPI {
    client: reqwest::Client,
}

impl MangaAPI {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    /// 搜索漫画
    pub async fn search(&self, keyword: &str) -> Result<Vec<MangaResult>, ApiError> {
        // 返回示例数据
        Ok(vec![MangaResult {
            id: "1".to_string(),
            title: format!("{} - 示例漫画", keyword),
            author: "未知作者".to_string(),
            description: "请访问对应漫画网站获取更多内容".to_string(),
            cover: "".to_string(),
            source: "manhua".to_string(),
        }])
    }
}

impl Default for MangaAPI {
    fn default() -> Self {
        Self::new()
    }
}

/// 全局 API 状态
pub struct AppState {
    pub music_api: MusicAPI,
    pub video_api: VideoAPI,
    pub novel_api: NovelAPI,
    pub manga_api: MangaAPI,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            music_api: MusicAPI::new(),
            video_api: VideoAPI::new(),
            novel_api: NovelAPI::new(),
            manga_api: MangaAPI::new(),
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}