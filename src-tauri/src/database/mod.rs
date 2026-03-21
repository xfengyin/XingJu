//! 数据库模块 - SQLite 持久化存储

pub mod favorite;
pub mod sync;

use sqlx::{SqlitePool, Row, sqlite::SqlitePoolOptions};
use serde::{Deserialize, Serialize};
use thiserror::Error;

/// 数据库错误
#[derive(Debug, Error)]
pub enum DatabaseError {
    #[error("Database connection error: {0}")]
    Connection(#[from] sqlx::Error),
    
    #[error("Migration error: {0}")]
    Migration(String),
}

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

/// 收藏记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FavoriteRecord {
    pub id: i64,
    pub module: String,
    pub item_id: String,
    pub title: String,
    pub cover: String,
    pub created_at: i64,
}

impl DatabaseManager {
    /// 创建新的数据库连接
    pub async fn new(database_url: &str) -> Result<Self, DatabaseError> {
        tracing::info!("Connecting to database: {}", database_url);
        
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await?;
        
        // 运行迁移
        Self::run_migrations(&pool).await?;
        
        Ok(Self { pool })
    }
    
    /// 运行数据库迁移
    async fn run_migrations(pool: &SqlitePool) -> Result<(), DatabaseError> {
        // 历史记录表
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
        .execute(pool)
        .await?;
        
        // 收藏表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT NOT NULL,
                item_id TEXT NOT NULL,
                title TEXT NOT NULL,
                cover TEXT,
                created_at INTEGER NOT NULL,
                UNIQUE(module, item_id)
            )
            "#
        )
        .execute(pool)
        .await?;
        
        // 创建索引
        sqlx::query("CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC)")
            .execute(pool)
            .await?;
        
        sqlx::query("CREATE INDEX IF NOT EXISTS idx_favorites_module ON favorites(module)")
            .execute(pool)
            .await?;
        
        tracing::info!("Database migrations completed");
        Ok(())
    }
    
    /// 添加历史记录
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
    
    /// 获取历史记录
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
    
    /// 清空历史记录
    pub async fn clear_history(&self) -> Result<(), sqlx::Error> {
        sqlx::query("DELETE FROM history")
            .execute(&self.pool)
            .await?;
        
        Ok(())
    }
    
    /// 添加收藏
    pub async fn add_favorite(&self, favorite: &FavoriteRecord) -> Result<bool, sqlx::Error> {
        let result = sqlx::query(
            r#"
            INSERT OR IGNORE INTO favorites (module, item_id, title, cover, created_at)
            VALUES (?, ?, ?, ?, ?)
            "#
        )
        .bind(&favorite.module)
        .bind(&favorite.item_id)
        .bind(&favorite.title)
        .bind(&favorite.cover)
        .bind(favorite.created_at)
        .execute(&self.pool)
        .await?;
        
        Ok(result.rows_affected() > 0)
    }
    
    /// 移除收藏
    pub async fn remove_favorite(&self, module: &str, item_id: &str) -> Result<(), sqlx::Error> {
        sqlx::query(
            "DELETE FROM favorites WHERE module = ? AND item_id = ?"
        )
        .bind(module)
        .bind(item_id)
        .execute(&self.pool)
        .await?;
        
        Ok(())
    }
    
    /// 获取收藏列表
    pub async fn get_favorites(&self, module: Option<&str>, limit: i32) -> Result<Vec<FavoriteRecord>, sqlx::Error> {
        let rows = if let Some(m) = module {
            sqlx::query(
                r#"
                SELECT id, module, item_id, title, cover, created_at
                FROM favorites
                WHERE module = ?
                ORDER BY created_at DESC
                LIMIT ?
                "#
            )
            .bind(m)
            .bind(limit)
            .fetch_all(&self.pool)
            .await?
        } else {
            sqlx::query(
                r#"
                SELECT id, module, item_id, title, cover, created_at
                FROM favorites
                ORDER BY created_at DESC
                LIMIT ?
                "#
            )
            .bind(limit)
            .fetch_all(&self.pool)
            .await?
        };
        
        let records = rows.into_iter().map(|row| {
            FavoriteRecord {
                id: row.get(0),
                module: row.get(1),
                item_id: row.get(2),
                title: row.get(3),
                cover: row.get(4),
                created_at: row.get(5),
            }
        }).collect();
        
        Ok(records)
    }
    
    /// 检查是否已收藏
    pub async fn is_favorited(&self, module: &str, item_id: &str) -> Result<bool, sqlx::Error> {
        let row: Option<(i64,)> = sqlx::query_as(
            "SELECT id FROM favorites WHERE module = ? AND item_id = ?"
        )
        .bind(module)
        .bind(item_id)
        .fetch_optional(&self.pool)
        .await?;
        
        Ok(row.is_some())
    }
}