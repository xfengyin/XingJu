//! 快捷键管理模块

use std::collections::HashMap;
use serde::{Deserialize, Serialize};

/// 快捷键动作
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HotkeyAction {
    pub name: String,
    pub description: String,
    pub default_keys: String,
}

/// 快捷键管理器
pub struct HotkeyManager {
    bindings: HashMap<String, String>,
    actions: Vec<HotkeyAction>,
}

impl HotkeyManager {
    pub fn new() -> Self {
        let mut manager = Self {
            bindings: HashMap::new(),
            actions: Vec::new(),
        };
        
        // 注册默认快捷键
        manager.register_default_hotkeys();
        manager
    }
    
    fn register_default_hotkeys(&mut self) {
        // 播放控制
        self.actions.push(HotkeyAction {
            name: "play_pause".to_string(),
            description: "播放/暂停".to_string(),
            default_keys: "Space".to_string(),
        });
        
        self.actions.push(HotkeyAction {
            name: "next_track".to_string(),
            description: "下一首".to_string(),
            default_keys: "Ctrl+Right".to_string(),
        });
        
        self.actions.push(HotkeyAction {
            name: "prev_track".to_string(),
            description: "上一首".to_string(),
            default_keys: "Ctrl+Left".to_string(),
        });
        
        // 搜索
        self.actions.push(HotkeyAction {
            name: "focus_search".to_string(),
            description: "聚焦搜索框".to_string(),
            default_keys: "Ctrl+F".to_string(),
        });
        
        // 模块切换
        self.actions.push(HotkeyAction {
            name: "switch_music".to_string(),
            description: "切换到音乐".to_string(),
            default_keys: "Ctrl+1".to_string(),
        });
        
        self.actions.push(HotkeyAction {
            name: "switch_video".to_string(),
            description: "切换到视频".to_string(),
            default_keys: "Ctrl+2".to_string(),
        });
        
        self.actions.push(HotkeyAction {
            name: "switch_novel".to_string(),
            description: "切换到小说".to_string(),
            default_keys: "Ctrl+3".to_string(),
        });
        
        self.actions.push(HotkeyAction {
            name: "switch_manga".to_string(),
            description: "切换到漫画".to_string(),
            default_keys: "Ctrl+4".to_string(),
        });
        
        // 初始化绑定
        for action in &self.actions {
            self.bindings.insert(action.name.clone(), action.default_keys.clone());
        }
    }
    
    pub fn get_binding(&self, action: &str) -> Option<&String> {
        self.bindings.get(action)
    }
    
    pub fn set_binding(&mut self, action: &str, keys: &str) {
        self.bindings.insert(action.to_string(), keys.to_string());
    }
    
    pub fn get_actions(&self) -> &Vec<HotkeyAction> {
        &self.actions
    }
    
    pub fn reset_to_default(&mut self) {
        for action in &self.actions {
            self.bindings.insert(action.name.clone(), action.default_keys.clone());
        }
    }
}

impl Default for HotkeyManager {
    fn default() -> Self {
        Self::new()
    }
}
