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
pub struct Video {
    pub id: String,
    pub title: String,
    pub duration: u32,
    pub url: String,
    pub cover: String,
    pub source: String,
}

/// 小说搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Novel {
    pub id: String,
    pub title: String,
    pub author: String,
    pub cover: String,
    pub source: String,
}

/// 漫画搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manga {
    pub id: String,
    pub title: String,
    pub author: String,
    pub cover: String,
    pub source: String,
}