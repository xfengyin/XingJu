//! XingJu 星聚 v2.0 - Tauri 应用核心

mod api;
mod container;
mod database;
mod cache;
mod utils;

use api::{MusicTrack, VideoResult, AppState};
use database::DatabaseManager;
use tauri::State;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};
use std::panic;
use std::sync::Arc;
use tokio::sync::Mutex;
use chrono::Utc;

fn setup_logging() {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("info"));
    
    tracing_subscriber::registry()
        .with(filter)
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    // 设置 panic hook 捕获未处理崩溃
    panic::set_hook(Box::new(|panic_info| {
        let msg = if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            s.to_string()
        } else if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            s.clone()
        } else {
            "Unknown panic".to_string()
        };
        
        let location = panic_info.location()
            .map(|l| format!("{}:{}:{}", l.file(), l.line(), l.column()))
            .unwrap_or_else(|| "unknown".to_string());
            
        tracing::error!("PANIC at {}: {}", location, msg);
    }));
}

/// 应用状态
pub struct AppContext {
    pub db: Arc<Mutex<Option<DatabaseManager>>>,
    pub api_state: AppState,
}

// ============ Tauri 命令 ============

/// 搜索音乐
#[tauri::command]
async fn search_music(
    keyword: String,
    source: String,
    state: State<'_, AppContext>,
) -> Result<Vec<MusicTrack>, String> {
    state.api_state.music_api
        .search(&keyword, &source)
        .await
        .map_err(|e| e.to_string())
}

/// 获取音乐播放链接
#[tauri::command]
async fn get_music_url(
    hash: String,
    album_id: String,
    state: State<'_, AppContext>,
) -> Result<String, String> {
    state.api_state.music_api
        .get_play_url(&hash, &album_id)
        .await
        .map_err(|e| e.to_string())
}

/// 搜索视频
#[tauri::command]
async fn search_video(
    keyword: String,
    source: String,
    state: State<'_, AppContext>,
) -> Result<Vec<VideoResult>, String> {
    state.api_state.video_api
        .search(&keyword, &source)
        .await
        .map_err(|e| e.to_string())
}

/// 搜索小说
#[tauri::command]
async fn search_novel(
    keyword: String,
    state: State<'_, AppContext>,
) -> Result<Vec<api::NovelResult>, String> {
    state.api_state.novel_api
        .search(&keyword)
        .await
        .map_err(|e| e.to_string())
}

/// 搜索漫画
#[tauri::command]
async fn search_manga(
    keyword: String,
    state: State<'_, AppContext>,
) -> Result<Vec<api::MangaResult>, String> {
    state.api_state.manga_api
        .search(&keyword)
        .await
        .map_err(|e| e.to_string())
}

/// 添加历史记录
#[tauri::command]
async fn add_history(
    module: String,
    title: String,
    state: State<'_, AppContext>,
) -> Result<(), String> {
    let db_guard = state.db.lock().await;
    if let Some(db) = db_guard.as_ref() {
        let record = database::HistoryRecord {
            id: 0,
            module,
            title,
            timestamp: Utc::now().timestamp(),
            metadata: "{}".to_string(),
        };
        db.add_history(&record).await.map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// 获取历史记录
#[tauri::command]
async fn get_history(
    limit: i32,
    state: State<'_, AppContext>,
) -> Result<Vec<database::HistoryRecord>, String> {
    let db_guard = state.db.lock().await;
    if let Some(db) = db_guard.as_ref() {
        db.get_history(limit).await.map_err(|e| e.to_string())
    } else {
        Ok(vec![])
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    setup_logging();
    tracing::info!("XingJu v2.0 starting...");
    
    // 初始化数据库
    let db_path = std::env::var("DATABASE_PATH")
        .unwrap_or_else(|_| "xingju.db".to_string());
    
    let db_manager = match std::thread::spawn(move || {
        tokio::runtime::Runtime::new()
            .unwrap()
            .block_on(async {
                DatabaseManager::new(&db_path).await
            })
    }).join() {
        Ok(Ok(db)) => {
            tracing::info!("Database initialized at {}", db_path);
            Some(db)
        }
        Ok(Err(e)) => {
            tracing::warn!("Failed to initialize database: {}", e);
            None
        }
        Err(e) => {
            tracing::warn!("Database thread panicked: {:?}", e);
            None
        }
    };
    
    let app_context = AppContext {
        db: Arc::new(Mutex::new(db_manager)),
        api_state: AppState::new(),
    };
    
    tauri::Builder::default()
        .manage(app_context)
        .invoke_handler(tauri::generate_handler![
            search_music,
            get_music_url,
            search_video,
            search_novel,
            search_manga,
            add_history,
            get_history,
        ])
        .setup(|_app| {
            tracing::info!("Application setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}