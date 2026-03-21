//! 多平台 API 集成
//! 
//! 提供 Tauri commands 供前端调用

pub mod providers;

use serde::{Deserialize, Serialize};
use tauri::State;
use crate::AppState;
use crate::database::{DatabaseManager, HistoryRecord};

// ============================================================================
// 数据模型
// ============================================================================

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
    pub chapters: u32,
    pub status: String,
}

/// 漫画搜索结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manga {
    pub id: String,
    pub title: String,
    pub author: String,
    pub cover: String,
    pub source: String,
    pub chapters: u32,
    pub status: String,
}

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

// ============================================================================
// 历史记录命令
// ============================================================================

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

#[tauri::command]
pub async fn clear_history(state: State<'_, AppState>) -> Result<(), String> {
    let db_guard = state.db.read().await;
    if let Some(db) = db_guard.as_ref() {
        db.clear_history().await.map_err(|e| e.to_string())
    } else {
        Err("Database not initialized".to_string())
    }
}

// ============================================================================
// 搜索命令
// ============================================================================

#[tauri::command]
pub async fn search_music(params: SearchParams) -> ApiResponse<Vec<MusicTrack>> {
    tracing::info!("Searching music: {}", params.query);
    match providers::netease::search_netease(&params.query, params.limit).await {
        resp => resp,
    }
}

#[tauri::command]
pub async fn search_video(params: SearchParams) -> ApiResponse<Vec<Video>> {
    tracing::info!("Searching video: {}", params.query);
    match providers::bilibili::search_bilibili(&params.query, params.limit).await {
        Ok(videos) => ApiResponse::success(videos),
        Err(e) => ApiResponse::error(e),
    }
}

#[tauri::command]
pub async fn search_novel(params: SearchParams) -> ApiResponse<Vec<Novel>> {
    tracing::info!("Searching novel: {}", params.query);
    match providers::qidian::search_novels(&params.query, params.limit).await {
        Ok(novels) => ApiResponse::success(novels),
        Err(e) => ApiResponse::error(e),
    }
}

#[tauri::command]
pub async fn search_manga(params: SearchParams) -> ApiResponse<Vec<Manga>> {
    tracing::info!("Searching manga: {}", params.query);
    match providers::qidian::search_manga(&params.query, params.limit).await {
        Ok(manga) => ApiResponse::success(manga),
        Err(e) => ApiResponse::error(e),
    }
}

// ============================================================================
// 收藏命令
// ============================================================================

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