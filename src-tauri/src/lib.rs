//! XingJu 星聚 v2.0 - Tauri 应用核心

mod api;
mod container;
mod database;
mod cache;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
