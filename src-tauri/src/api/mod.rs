//! 多平台 API 集成模块
//!
//! 提供音乐、视频、小说、漫画等平台的搜索接口

pub mod manga;
pub mod music;
pub mod novel;
pub mod video;

// 重导出通用数据结构
pub use manga::Manga;
pub use music::MusicTrack;
pub use novel::Novel;
pub use video::Video;

use serde::{Deserialize, Serialize};

/// 通用搜索结果包装
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult<T> {
    /// 数据列表
    pub data: Vec<T>,
    /// 总数
    pub total: u32,
    /// 当前页码
    pub page: i32,
    /// 每页数量
    pub page_size: i32,
    /// 数据源
    pub source: String,
}

impl<T> SearchResult<T> {
    /// 创建新的搜索结果
    pub fn new(data: Vec<T>, total: u32, page: i32, page_size: i32, source: &str) -> Self {
        Self {
            data,
            total,
            page,
            page_size,
            source: source.to_string(),
        }
    }

    /// 创建空结果
    pub fn empty(source: &str) -> Self {
        Self {
            data: vec![],
            total: 0,
            page: 1,
            page_size: 20,
            source: source.to_string(),
        }
    }
}

/// API 错误类型
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("网络请求失败: {0}")]
    Network(String),

    #[error("数据解析失败: {0}")]
    Parse(String),

    #[error("不支持的数据源: {0}")]
    UnsupportedSource(String),

    #[error("请求超时")]
    Timeout,
}

impl From<reqwest::Error> for ApiError {
    fn from(e: reqwest::Error) -> Self {
        if e.is_timeout() {
            ApiError::Timeout
        } else {
            ApiError::Network(e.to_string())
        }
    }
}

impl From<serde_json::Error> for ApiError {
    fn from(e: serde_json::Error) -> Self {
        ApiError::Parse(e.to_string())
    }
}

// ============================================================================
// 搜索命令 - 适配前端调用格式
// ============================================================================

/// 搜索参数
#[derive(Debug, Clone, Deserialize)]
pub struct SearchParams {
    pub query: String,
    #[serde(default)]
    pub source: Option<String>,
    #[serde(default = "default_limit")]
    pub limit: u32,
}

fn default_limit() -> u32 { 20 }

/// API 响应
#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self { success: true, data: Some(data), error: None }
    }
    
    pub fn error(msg: impl Into<String>) -> Self {
        Self { success: false, data: None, error: Some(msg.into()) }
    }
}

/// 搜索音乐
#[tauri::command]
pub async fn search_music(params: SearchParams) -> ApiResponse<Vec<MusicTrack>> {
    tracing::info!("Searching music: {}", params.query);
    
    let source = params.source.unwrap_or_else(|| "netease".to_string());
    
    match music::search_music(params.query.clone(), source, 1, params.limit as i32).await {
        Ok(result) => ApiResponse::success(result.data),
        Err(e) => ApiResponse::error(e),
    }
}

/// 搜索视频
#[tauri::command]
pub async fn search_video(params: SearchParams) -> ApiResponse<Vec<Video>> {
    tracing::info!("Searching video: {}", params.query);
    
    let source = params.source.unwrap_or_else(|| "bilibili".to_string());
    
    match video::search_video(params.query.clone(), source, 1, params.limit as i32).await {
        Ok(result) => ApiResponse::success(result.data),
        Err(e) => ApiResponse::error(e),
    }
}

/// 搜索小说
#[tauri::command]
pub async fn search_novel(params: SearchParams) -> ApiResponse<Vec<Novel>> {
    tracing::info!("Searching novel: {}", params.query);
    
    match novel::search_novel(params.query.clone(), "qidian".to_string(), 1, params.limit as i32).await {
        Ok(result) => ApiResponse::success(result.data),
        Err(e) => ApiResponse::error(e),
    }
}

/// 搜索漫画
#[tauri::command]
pub async fn search_manga(params: SearchParams) -> ApiResponse<Vec<Manga>> {
    tracing::info!("Searching manga: {}", params.query);
    
    match manga::search_manga(params.query.clone(), "manhua".to_string(), 1, params.limit as i32).await {
        Ok(result) => ApiResponse::success(result.data),
        Err(e) => ApiResponse::error(e),
    }
}

// ============================================================================
// 历史记录命令
// ============================================================================

use crate::database::{DatabaseManager, HistoryRecord};
use tauri::State;
use crate::AppState;

/// 获取历史记录
#[tauri::command]
pub async fn get_history(
    state: State<'_, AppState>,
    limit: i32,
) -> Result<Vec<HistoryRecord>, String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.get_history(limit).await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

/// 添加历史记录
#[tauri::command]
pub async fn add_history(
    state: State<'_, AppState>,
    module: String,
    title: String,
    metadata: String,
) -> Result<(), String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        let record = HistoryRecord {
            id: 0,
            module,
            title,
            timestamp: chrono::Utc::now().timestamp(),
            metadata,
        };
        db.add_history(&record).await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

/// 清空历史记录
#[tauri::command]
pub async fn clear_history(
    state: State<'_, AppState>,
) -> Result<(), String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.clear_history().await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

// ============================================================================
// 收藏命令
// ============================================================================

/// 添加收藏
#[tauri::command]
pub async fn add_favorite(
    state: State<'_, AppState>,
    module: String,
    item_id: String,
    title: String,
    cover: String,
) -> Result<bool, String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.add_favorite(&crate::database::FavoriteRecord {
            id: 0,
            module,
            item_id,
            title,
            cover,
            created_at: chrono::Utc::now().timestamp(),
        }).await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

/// 获取收藏列表
#[tauri::command]
pub async fn get_favorites(
    state: State<'_, AppState>,
    module: Option<String>,
    limit: i32,
) -> Result<Vec<crate::database::FavoriteRecord>, String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.get_favorites(module.as_deref(), limit).await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

/// 移除收藏
#[tauri::command]
pub async fn remove_favorite(
    state: State<'_, AppState>,
    module: String,
    item_id: String,
) -> Result<(), String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.remove_favorite(&module, &item_id).await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}