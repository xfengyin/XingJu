//! 数据库模块 - SQLite

use sqlx::{SqlitePool, Row};
use serde::{Deserialize, Serialize};

/// 数据库管理器
pub struct DatabaseManager {
    pool: SqlitePool,
}

/// 历史记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryRecord {
    pub id: i64,
    pub module: String,
    pub title: String,
    pub timestamp: i64,
    pub metadata: String,
}

impl DatabaseManager {
    pub async fn new(database_path: &str) -> Result<Self, sqlx::Error> {
        let pool = SqlitePool::connect(database_path).await?;
        
        // 创建表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT NOT NULL,
                title TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                metadata TEXT
            )
            "#
        )
        .execute(&pool)
        .await?;
        
        Ok(Self { pool })
    }
    
    pub async fn add_history(&self, record: &HistoryRecord) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO history (module, title, timestamp, metadata)
            VALUES (?, ?, ?, ?)
            "#
        )
        .bind(&record.module)
        .bind(&record.title)
        .bind(record.timestamp)
        .bind(&record.metadata)
        .execute(&self.pool)
        .await?;
        
        Ok(())
    }
    
    pub async fn get_history(&self, limit: i32) -> Result<Vec<HistoryRecord>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, module, title, timestamp, metadata
            FROM history
            ORDER BY timestamp DESC
            LIMIT ?
            "#
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        
        let records = rows.into_iter().map(|row| {
            HistoryRecord {
                id: row.get(0),
                module: row.get(1),
                title: row.get(2),
                timestamp: row.get(3),
                metadata: row.get(4),
            }
        }).collect();
        
        Ok(records)
    }
}
