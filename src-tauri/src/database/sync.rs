//! 数据同步模块

use serde::{Deserialize, Serialize};

/// 同步数据类型
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SyncDataType {
    History,
    Favorite,
    Settings,
    Playlist,
}

/// 同步记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncRecord {
    pub id: String,
    pub data_type: SyncDataType,
    pub data: String,
    pub timestamp: i64,
    pub synced: bool,
}

/// 同步管理器
pub struct SyncManager {
    records: Vec<SyncRecord>,
}

impl SyncManager {
    pub fn new() -> Self {
        Self {
            records: Vec::new(),
        }
    }
    
    pub fn add_record(&mut self, record: SyncRecord) {
        self.records.push(record);
    }
    
    pub fn get_unsynced(&self) -> Vec<&SyncRecord> {
        self.records.iter().filter(|r| !r.synced).collect()
    }
    
    pub fn mark_synced(&mut self, id: &str) {
        if let Some(record) = self.records.iter_mut().find(|r| r.id == id) {
            record.synced = true;
        }
    }
    
    pub fn sync_all(&mut self) -> Vec<String> {
        let mut synced_ids = Vec::new();
        for record in &mut self.records {
            if !record.synced {
                // TODO: 实际同步逻辑
                record.synced = true;
                synced_ids.push(record.id.clone());
            }
        }
        synced_ids
    }
}

impl Default for SyncManager {
    fn default() -> Self {
        Self::new()
    }
}
