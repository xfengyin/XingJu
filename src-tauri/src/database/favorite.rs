//! 收藏夹管理模块

use sqlx::{SqlitePool, Row};
use serde::{Deserialize, Serialize};

/// 收藏项
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FavoriteItem {
    pub id: i64,
    pub module: String,
    pub title: String,
    pub item_id: String,
    pub metadata: String,
    pub created_at: i64,
}

/// 收藏夹管理器
pub struct FavoriteManager {
    pool: SqlitePool,
}

impl FavoriteManager {
    pub async fn new(pool: SqlitePool) -> Result<Self, sqlx::Error> {
        // 创建表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT NOT NULL,
                title TEXT NOT NULL,
                item_id TEXT NOT NULL,
                metadata TEXT,
                created_at INTEGER NOT NULL
            )
            "#
        )
        .execute(&pool)
        .await?;
        
        Ok(Self { pool })
    }
    
    pub async fn add(&self, item: &FavoriteItem) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO favorites (module, title, item_id, metadata, created_at)
            VALUES (?, ?, ?, ?, ?)
            "#
        )
        .bind(&item.module)
        .bind(&item.title)
        .bind(&item.item_id)
        .bind(&item.metadata)
        .bind(item.created_at)
        .execute(&self.pool)
        .await?;
        
        Ok(())
    }
    
    pub async fn remove(&self, id: i64) -> Result<(), sqlx::Error> {
        sqlx::query("DELETE FROM favorites WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;
        
        Ok(())
    }
    
    pub async fn get_by_module(&self, module: &str) -> Result<Vec<FavoriteItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, module, title, item_id, metadata, created_at
            FROM favorites
            WHERE module = ?
            ORDER BY created_at DESC
            "#
        )
        .bind(module)
        .fetch_all(&self.pool)
        .await?;
        
        let items = rows.into_iter().map(|row| {
            FavoriteItem {
                id: row.get(0),
                module: row.get(1),
                title: row.get(2),
                item_id: row.get(3),
                metadata: row.get(4),
                created_at: row.get(5),
            }
        }).collect();
        
        Ok(items)
    }
    
    pub async fn get_all(&self) -> Result<Vec<FavoriteItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, module, title, item_id, metadata, created_at
            FROM favorites
            ORDER BY created_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;
        
        let items = rows.into_iter().map(|row| {
            FavoriteItem {
                id: row.get(0),
                module: row.get(1),
                title: row.get(2),
                item_id: row.get(3),
                metadata: row.get(4),
                created_at: row.get(5),
            }
        }).collect();
        
        Ok(items)
    }
}
