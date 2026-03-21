//! 多平台 API 集成
//! 
//! 提供 Tauri commands 供前端调用

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
// 搜索命令 (占位实现，后续接入真实 API)
// ============================================================================

/// 搜索音乐
#[tauri::command]
pub async fn search_music(params: SearchParams) -> ApiResponse<Vec<MusicTrack>> {
    // TODO: 接入真实音乐 API (网易云、QQ音乐、酷狗等)
    // 目前返回模拟数据用于开发测试
    tracing::info!("Searching music: {}", params.query);
    
    let mock_results: Vec<MusicTrack> = (0..params.limit.min(10))
        .map(|i| MusicTrack {
            id: format!("music_{}", i),
            title: format!("{} - 搜索结果 {}", params.query, i + 1),
            artist: "模拟艺术家".to_string(),
            album: "模拟专辑".to_string(),
            duration: 180 + i * 30,
            url: format!("https://example.com/music/{}.mp3", i),
            cover: "🎵".to_string(),
            source: match i % 3 {
                0 => "netease".to_string(),
                1 => "qq".to_string(),
                _ => "kugou".to_string(),
            },
        })
        .collect();
    
    ApiResponse::success(mock_results)
}

/// 搜索视频
#[tauri::command]
pub async fn search_video(params: SearchParams) -> ApiResponse<Vec<Video>> {
    tracing::info!("Searching video: {}", params.query);
    
    let mock_results: Vec<Video> = (0..params.limit.min(10))
        .map(|i| Video {
            id: format!("video_{}", i),
            title: format!("{} - 视频 {}", params.query, i + 1),
            duration: 1200 + i * 300,
            url: format!("https://example.com/video/{}.mp4", i),
            cover: "🎬".to_string(),
            source: match i % 2 {
                0 => "bilibili".to_string(),
                _ => "youku".to_string(),
            },
        })
        .collect();
    
    ApiResponse::success(mock_results)
}

/// 搜索小说
#[tauri::command]
pub async fn search_novel(params: SearchParams) -> ApiResponse<Vec<Novel>> {
    tracing::info!("Searching novel: {}", params.query);
    
    let mock_results: Vec<Novel> = (0..params.limit.min(10))
        .map(|i| Novel {
            id: format!("novel_{}", i),
            title: format!("{} - 小说 {}", params.query, i + 1),
            author: "模拟作者".to_string(),
            cover: "📖".to_string(),
            source: "qidian".to_string(),
            chapters: 100 + i * 50,
            status: if i % 2 == 0 { "连载中".to_string() } else { "已完结".to_string() },
        })
        .collect();
    
    ApiResponse::success(mock_results)
}

/// 搜索漫画
#[tauri::command]
pub async fn search_manga(params: SearchParams) -> ApiResponse<Vec<Manga>> {
    tracing::info!("Searching manga: {}", params.query);
    
    let mock_results: Vec<Manga> = (0..params.limit.min(10))
        .map(|i| Manga {
            id: format!("manga_{}", i),
            title: format!("{} - 漫画 {}", params.query, i + 1),
            author: "模拟作者".to_string(),
            cover: "📚".to_string(),
            source: "manhua".to_string(),
            chapters: 50 + i * 20,
            status: if i % 2 == 0 { "连载中".to_string() } else { "已完结".to_string() },
        })
        .collect();
    
    ApiResponse::success(mock_results)
}