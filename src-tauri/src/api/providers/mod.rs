//! 多平台 API 提供者
//! 
//! 实现各平台的真实 API 调用

pub mod netease;
pub mod bilibili;
pub mod qidian;

use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::time::Duration;

/// HTTP 客户端构建器
pub fn create_client() -> Client {
    Client::builder()
        .timeout(Duration::from_secs(30))
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .build()
        .expect("Failed to create HTTP client")
}

/// 通用搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult<T> {
    pub items: Vec<T>,
    pub total: u32,
    pub has_more: bool,
}

/// 音乐提供者 trait
pub trait MusicProvider: Send + Sync {
    fn name(&self) -> &str;
    fn search(&self, query: &str, limit: u32) -> impl std::future::Future<Output = Result<Vec<super::MusicTrack>, String>> + Send;
}

/// 视频提供者 trait  
pub trait VideoProvider: Send + Sync {
    fn name(&self) -> &str;
    fn search(&self, query: &str, limit: u32) -> impl std::future::Future<Output = Result<Vec<super::Video>, String>> + Send;
}