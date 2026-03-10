//! 插件系统模块

use std::collections::HashMap;
use serde::{Deserialize, Serialize};

/// 插件信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub enabled: bool,
}

/// 插件管理器
pub struct PluginManager {
    plugins: HashMap<String, PluginInfo>,
    plugin_dir: String,
}

impl PluginManager {
    pub fn new(plugin_dir: &str) -> Self {
        Self {
            plugins: HashMap::new(),
            plugin_dir: plugin_dir.to_string(),
        }
    }
    
    pub fn register_plugin(&mut self, info: PluginInfo) {
        self.plugins.insert(info.id.clone(), info);
    }
    
    pub fn unregister_plugin(&mut self, plugin_id: &str) -> Option<PluginInfo> {
        self.plugins.remove(plugin_id)
    }
    
    pub fn enable_plugin(&mut self, plugin_id: &str) -> bool {
        if let Some(plugin) = self.plugins.get_mut(plugin_id) {
            plugin.enabled = true;
            true
        } else {
            false
        }
    }
    
    pub fn disable_plugin(&mut self, plugin_id: &str) -> bool {
        if let Some(plugin) = self.plugins.get_mut(plugin_id) {
            plugin.enabled = false;
            true
        } else {
            false
        }
    }
    
    pub fn get_plugin(&self, plugin_id: &str) -> Option<&PluginInfo> {
        self.plugins.get(plugin_id)
    }
    
    pub fn list_plugins(&self) -> Vec<&PluginInfo> {
        self.plugins.values().collect()
    }
    
    pub fn list_enabled(&self) -> Vec<&PluginInfo> {
        self.plugins.values().filter(|p| p.enabled).collect()
    }
}

impl Default for PluginManager {
    fn default() -> Self {
        Self {
            plugins: HashMap::new(),
            plugin_dir: "plugins".to_string(),
        }
    }
}
