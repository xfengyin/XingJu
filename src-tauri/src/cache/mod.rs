//! 缓存管理模块

use std::collections::HashMap;
use serde::{Deserialize, Serialize};

/// 缓存条目
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheEntry {
    pub key: String,
    pub value: String,
    pub expires_at: Option<i64>,
}

/// 缓存管理器
pub struct CacheManager {
    cache: HashMap<String, CacheEntry>,
}

impl CacheManager {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }
    
    pub fn get(&self, key: &str) -> Option<&String> {
        self.cache.get(key).map(|entry| &entry.value)
    }
    
    pub fn set(&mut self, key: String, value: String, ttl_seconds: Option<u64>) {
        let expires_at = ttl_seconds.map(|ttl| {
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() as i64 + ttl as i64
        });
        
        self.cache.insert(key, CacheEntry {
            key: key.clone(),
            value,
            expires_at,
        });
    }
    
    pub fn remove(&mut self, key: &str) -> Option<CacheEntry> {
        self.cache.remove(key)
    }
    
    pub fn clear(&mut self) {
        self.cache.clear();
    }
    
    pub fn cleanup_expired(&mut self) {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
        
        self.cache.retain(|_, entry| {
            entry.expires_at.map_or(true, |exp| exp > now)
        });
    }
}

impl Default for CacheManager {
    fn default() -> Self {
        Self::new()
    }
}
