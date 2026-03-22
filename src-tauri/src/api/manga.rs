//! 漫画搜索 API 实现
//!
//! 支持腾讯动漫、哔哩哔哩漫画等平台搜索

use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::api::{ApiError, SearchResult};

/// 漫画信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manga {
    /// 漫画 ID
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
    /// 分类标签
    pub tags: Vec<String>,
    /// 状态（连载中/已完结）
    pub status: String,
    /// 更新章节
    pub latest_chapter: String,
}

/// 支持的漫画源
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MangaSource {
    pub id: String,
    pub name: String,
    pub icon: String,
}

/// HTTP 客户端（使用全局缓存）
static HTTP_CLIENT: once_cell::sync::Lazy<Arc<Client>> =
    once_cell::sync::Lazy::new(|| Arc::new(Client::builder().timeout(std::time::Duration::from_secs(10)).build().unwrap()));

/// 获取支持的漫画源列表
#[tauri::command]
pub async fn get_manga_source() -> Vec<MangaSource> {
    vec![
        MangaSource {
            id: "tencent".to_string(),
            name: "腾讯动漫".to_string(),
            icon: "tencent".to_string(),
        },
        MangaSource {
            id: "bilibili".to_string(),
            name: "哔哩哔哩漫画".to_string(),
            icon: "bilibili".to_string(),
        },
        MangaSource {
            id: "mock".to_string(),
            name: "测试数据".to_string(),
            icon: "mock".to_string(),
        },
    ]
}

/// 搜索漫画
///
/// # 参数
/// - `keyword`: 搜索关键词
/// - `source`: 数据源 (tencent, bilibili, mock)
/// - `page`: 页码
/// - `page_size`: 每页数量
#[tauri::command]
pub async fn search_manga(
    keyword: String,
    source: String,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Manga>, String> {
    tracing::info!("搜索漫画: keyword={}, source={}, page={}", keyword, source, page);

    let client = HTTP_CLIENT.clone();

    let result = match source.as_str() {
        "tencent" => search_tencent(&client, &keyword, page, page_size).await,
        "bilibili" => search_bilibili(&client, &keyword, page, page_size).await,
        "mock" => Ok(mock_manga_search(&keyword, page, page_size)),
        _ => return Err(format!("不支持的漫画源: {}", source)),
    };

    result.map_err(|e: ApiError| e.to_string())
}

/// 腾讯动漫 API 搜索
async fn search_tencent(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Manga>, ApiError> {
    // TODO: 实现真实的腾讯动漫 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("腾讯动漫搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_manga_search(keyword, page, page_size))
}

/// 哔哩哔哩漫画 API 搜索
async fn search_bilibili(
    client: &Client,
    keyword: &str,
    page: i32,
    page_size: i32,
) -> Result<SearchResult<Manga>, ApiError> {
    // TODO: 实现真实的哔哩哔哩漫画 API
    // 目前返回模拟数据，确保前后端通信正常
    tracing::info!("哔哩哔哩漫画搜索 (模拟): {}", keyword);

    // 模拟网络延迟
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;

    Ok(mock_manga_search(keyword, page, page_size))
}

/// 生成模拟漫画数据
fn mock_manga_search(keyword: &str, page: i32, page_size: i32) -> SearchResult<Manga> {
    let start = (page - 1) * page_size;
    let mangas: Vec<Manga> = (0..page_size)
        .map(|i| {
            let idx = start + i;
            Manga {
                id: format!("manga_{}", idx),
                title: format!("{} - 漫画 {}", keyword, idx + 1),
                author: "模拟作者".to_string(),
                cover: "https://picsum.photos/180/240".to_string(),
                source: "mock".to_string(),
                description: format!(
                    "这是一部关于{}的精彩漫画，讲述了主人公的传奇故事...",
                    keyword
                ),
                tags: vec!["热血".to_string(), "冒险".to_string()],
                status: if idx % 2 == 0 { "已完结" } else { "连载中" }.to_string(),
                latest_chapter: format!("第{}话", 100 + idx),
            }
        })
        .collect();

    SearchResult::new(mangas, 40, page, page_size, "mock")
}