//! 小说搜索 API 实现
//!
//! 支持起点中文网、纵横中文网等平台搜索

use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::{ApiError, SearchResult};

/// 小说信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Novel {
    /// 小说 ID
    pub id: String,
    /// 标题
    pub title: String,
    /// 作者
    pub author: String,
    /// 封面图片
    pub cover: String,
    /// 数据源
    pub source: String,
    /// 简介
    pub description: String,
    /// 分类
    pub category: String,
    /// 字数
    pub word_count: u64,
    /// 状态（连载中/已完结）
    pub status: String,
}

/// 支持的小说源
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NovelSource {
    pub id: String,
    pub name: String,
    pub icon: String,
}

/// HTTP 客户端（使用全局缓存）
static HTTP_CLIENT: once_cell::sync::Lazy<Arc<Client>> =
    once_cell::sync::Lazy::new(|| Arc::new(Client::builder().timeout(std::time::Duration::from_secs(10)).build().unwrap()));

/// 获取支持的小说源列表
#[tauri::command]
pub async fn get_novel_source() -> Vec<NovelSource> {
    vec![
        NovelSource {
            id: "qidian".to_string(),
            name: "起点中文网".to_string(),
            icon: "qidian".to_string(),
        },
        NovelSource {
            id: "zongheng".to_string(),
            name: "纵横中文网".to_string(),
            icon: "zongheng".to_string(),
        },
        NovelSource {
            id: "mock".to_string(),
            name: "测试数据".to_string(),
            icon: "mock".to_string(),
        },
    ]
}

/// 搜索小说
///
/// # 参数
/// - `keyword`: 搜索关键词
/// - `source`: 数据源 (qidian, zongheng, mock)
/// - `page`: 页码
/// - `page_size`: 每页数量
#[tauri::command]
pub async fn search_novel(
    keyword: String,
    source: String,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Novel>, String> {
    tracing::info!("搜索小说: keyword={}, source={}, page={}", keyword, source, page);

    let client = HTTP_CLIENT.clone();

    let result = match source.as_str() {
        "qidian" => search_qidian(&client, &keyword, page, page_size).await,
        "zongheng" => search_zongheng(&client, &keyword, page, page_size).await,
        "mock" => Ok(mock_novel_search(&keyword, page, page_size)),
        _ => return Err(format!("不支持的小说源: {}", source)),
    };

    result.map_err(|e: ApiError| e.to_string())
}

/// 起点中文网 API 搜索
async fn search_qidian(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Novel>, ApiError> {
    // TODO: 实现真实的起点 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("起点搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_novel_search(keyword, page, page_size))
}

/// 纵横中文网 API 搜索
async fn search_zongheng(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Novel>, ApiError> {
    // TODO: 实现真实的纵横 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("纵横搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_novel_search(keyword, page, page_size))
}

/// 生成模拟小说数据
fn mock_novel_search(keyword: &str, page: i32, page_size: i32) -> SearchResult<Novel> {
    let start = (page - 1) * page_size;
    let novels: Vec<Novel> = (0..page_size)
        .map(|i| {
            let idx = start + i;
            Novel {
                id: format!("novel_{}", idx),
                title: format!("{} - 小说 {}", keyword, idx + 1),
                author: "模拟作者".to_string(),
                cover: "https://picsum.photos/150/200".to_string(),
                source: "mock".to_string(),
                description: format!(
                    "这是一部关于{}的精彩小说，讲述了主人公的传奇故事...",
                    keyword
                ),
                category: "玄幻".to_string(),
                word_count: 1000000 + (idx as u64 * 100000),
                status: if idx % 3 == 0 { "已完结" } else { "连载中" }.to_string(),
            }
        })
        .collect();

    SearchResult::new(novels, 30, page, page_size, "mock")
}