//! XingJu 星聚 v2.0 - Tauri 应用核心
//! 
//! 多平台聚合应用 - 音乐/视频/小说/漫画

mod api;
mod container;
mod database;
mod cache;
mod utils;

use std::sync::Arc;
use tauri::Manager;
use tokio::sync::RwLock;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use database::DatabaseManager;

/// 应用状态
pub struct AppState {
    pub db: Arc<RwLock<Option<DatabaseManager>>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            db: Arc::new(RwLock::new(None)),
        }
    }
}

fn setup_logging() {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("info"));
    
    tracing_subscriber::registry()
        .with(filter)
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    // 设置 panic hook 捕获未处理崩溃
    std::panic::set_hook(Box::new(|panic_info| {
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    setup_logging();
    tracing::info!("XingJu v2.0 starting...");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState::default())
        .setup(|app| {
            let app_handle = app.handle().clone();
            
            // 异步初始化数据库
            tauri::async_runtime::spawn(async move {
                let state = app_handle.state::<AppState>();
                let db_path = app_handle
                    .path()
                    .app_data_dir()
                    .map(|p| p.join("xingju.db"))
                    .unwrap_or_else(|_| std::path::PathBuf::from("xingju.db"));
                
                // 确保目录存在
                if let Some(parent) = db_path.parent() {
                    if !parent.exists() {
                        if let Err(e) = std::fs::create_dir_all(parent) {
                            tracing::error!("Failed to create data directory: {}", e);
                            return;
                        }
                    }
                }
                
                let db_url = format!("sqlite:{}?mode=rwc", db_path.display());
                tracing::info!("Database path: {}", db_url);
                
                match DatabaseManager::new(&db_url).await {
                    Ok(db) => {
                        let mut db_lock = state.db.write().await;
                        *db_lock = Some(db);
                        tracing::info!("Database initialized successfully");
                    }
                    Err(e) => {
                        tracing::error!("Failed to initialize database: {}", e);
                    }
                }
            });
            
            tracing::info!("Application setup complete");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // 历史记录命令
            api::get_history,
            api::add_history,
            api::clear_history,
            // 搜索命令
            api::search_music,
            api::search_video,
            api::search_novel,
            api::search_manga,
            // 收藏命令
            api::add_favorite,
            api::get_favorites,
            api::remove_favorite,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}