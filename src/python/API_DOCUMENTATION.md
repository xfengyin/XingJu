# XingJu Python API - 完整文档

## 概述

XingJu 是一个多元内容聚合后端服务，提供音乐、视频、小说、漫画的搜索、详情获取和播放/阅读链接获取功能。

## 技术栈

- **框架**: FastAPI 0.109.0
- **异步 HTTP**: aiohttp 3.9.1
- **数据验证**: Pydantic 2.5.3
- **缓存**: Redis 5.0.1 (可选)
- **服务器**: Uvicorn 0.27.0

## 快速开始

### 安装依赖

```bash
cd /home/node/.openclaw/workspace/projects/XingJu/src/python
pip install -r requirements.txt
```

### 启动服务

```bash
python main.py
```

或使用 uvicorn:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 访问 API 文档

启动后访问：
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## API 端点

### 🎵 音乐 API (`/api/music`)

#### 搜索音乐
```
GET /api/music/search
```

**查询参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | 是 | - | 搜索关键词（至少 1 字符） |
| page | integer | 否 | 1 | 页码（≥1） |
| page_size | integer | 否 | 20 | 每页数量（1-100） |
| source | string | 否 | null | 来源平台（netease/qq/kugou/migu） |
| sort_by | string | 否 | relevance | 排序方式（relevance/rating/views/duration） |

**响应示例:**
```json
{
  "songs": [
    {
      "id": "song_001",
      "title": "晴天",
      "artist": "周杰伦",
      "album": "叶惠美",
      "duration": 269,
      "cover": "https://example.com/covers/qingtian.jpg",
      "source": "netease",
      "rating": 4.9,
      "views": 1000000
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

#### 获取歌曲详情
```
GET /api/music/{song_id}
```

**响应示例:**
```json
{
  "id": "song_001",
  "title": "晴天",
  "artist": "周杰伦",
  "album": "叶惠美",
  "duration": 269,
  "cover": "https://example.com/covers/qingtian.jpg",
  "source": "netease",
  "rating": 4.9,
  "views": 1000000,
  "lyric": "[00:00.00] 晴天\n[00:01.00] 周杰伦\n...",
  "extra": {
    "bitrate": 320,
    "format": "mp3",
    "size_mb": 10.23
  }
}
```

#### 获取播放链接
```
GET /api/music/{song_id}/url?quality=high
```

**查询参数:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| quality | string | standard | 音质（standard/high/lossless） |

**响应示例:**
```json
{
  "song_id": "song_001",
  "url": "https://music.example.com/play/song_001.320k",
  "quality": "high",
  "bitrate": 320,
  "format": "mp3",
  "expires": "2024-03-10T09:25:00",
  "size_mb": 10.23
}
```

#### 获取歌词
```
GET /api/music/{song_id}/lyric
```

**响应示例:**
```json
{
  "song_id": "song_001",
  "title": "晴天",
  "artist": "周杰伦",
  "lyric": "[00:00.00] 晴天\n[00:01.00] 周杰伦\n...",
  "has_translation": false,
  "language": "zh"
}
```

---

### 📺 视频 API (`/api/video`)

#### 搜索视频
```
GET /api/video/search
```

**查询参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | 是 | - | 搜索关键词 |
| page | integer | 否 | 1 | 页码 |
| page_size | integer | 否 | 20 | 每页数量 |
| source | string | 否 | null | 来源平台（bilibili/tencent/iqiyi/youku） |
| category | string | 否 | null | 分类筛选 |
| sort_by | string | 否 | relevance | 排序方式（relevance/rating/views/duration/date） |

**响应示例:**
```json
{
  "videos": [
    {
      "id": "video_001",
      "title": "【官方】2024 年最新科技发布会全程回放",
      "description": "2024 年度科技盛会",
      "cover": "https://example.com/covers/tech2024.jpg",
      "duration": 7200,
      "source": "bilibili",
      "author": "科技前沿",
      "views": 2500000,
      "rating": 4.9,
      "tags": ["科技", "发布会", "2024"],
      "publish_date": "2024-03-01T10:00:00"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

#### 获取视频详情
```
GET /api/video/{video_id}
```

#### 获取播放链接
```
GET /api/video/{video_id}/url?quality=1080p
```

**查询参数:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| quality | string | 1080p | 画质（360p/480p/720p/1080p/4k） |

#### 获取弹幕
```
GET /api/video/{video_id}/danmaku?timestamp=60
```

**响应示例:**
```json
{
  "video_id": "video_001",
  "danmakus": [
    {
      "id": "dm_1",
      "content": "这是弹幕内容 1",
      "timestamp": 45,
      "position": 1,
      "color": "#FFFFFF",
      "user": "user_1234"
    }
  ],
  "total": 5680
}
```

---

### 📚 小说 API (`/api/novel`)

#### 搜索小说
```
GET /api/novel/search
```

**查询参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | 是 | - | 搜索关键词 |
| page | integer | 否 | 1 | 页码 |
| page_size | integer | 否 | 20 | 每页数量 |
| source | string | 否 | null | 来源平台（qidian/jjwxc/zongheng/17k） |
| category | string | 否 | null | 分类（玄幻/仙侠/都市/科幻等） |
| sort_by | string | 否 | relevance | 排序方式（relevance/rating/views/word_count/update） |

**响应示例:**
```json
{
  "novels": [
    {
      "id": "novel_001",
      "title": "斗破苍穹",
      "author": "天蚕土豆",
      "description": "天才少年萧炎的故事...",
      "cover": "https://example.com/covers/doupocangqiong.jpg",
      "source": "qidian",
      "category": "玄幻",
      "status": "完结",
      "word_count": 5300000,
      "chapter_count": 1648,
      "rating": 4.8,
      "views": 100000000,
      "tags": ["玄幻", "热血", "升级"],
      "last_update": "2023-12-01T00:00:00"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

#### 获取小说详情
```
GET /api/novel/{novel_id}
```

#### 获取章节列表
```
GET /api/novel/{novel_id}/chapters?page=1&page_size=100
```

**响应示例:**
```json
{
  "chapters": [
    {
      "id": "novel_001_ch0001",
      "title": "第 1 章 开始",
      "number": 1,
      "word_count": 3245,
      "is_vip": false,
      "publish_date": "2024-03-09T09:25:00"
    }
  ],
  "total": 1648,
  "page": 1,
  "page_size": 100,
  "novel_id": "novel_001",
  "novel_title": "斗破苍穹"
}
```

#### 获取章节内容
```
GET /api/novel/{novel_id}/chapters/{chapter_id}
```

**响应示例:**
```json
{
  "chapter_id": "novel_001_ch0001",
  "novel_id": "novel_001",
  "title": "第 1 章 开始",
  "content": "这是第 1 章的内容...\n\n在这个章节中，故事继续发展...",
  "number": 1,
  "word_count": 256,
  "prev_chapter_id": null,
  "next_chapter_id": "novel_001_ch0002",
  "is_vip": false
}
```

---

### 🎨 漫画 API (`/api/manga`)

#### 搜索漫画
```
GET /api/manga/search
```

**查询参数:**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | 是 | - | 搜索关键词 |
| page | integer | 否 | 1 | 页码 |
| page_size | integer | 否 | 20 | 每页数量 |
| source | string | 否 | null | 来源平台（bilibili/tencent/kuaikan/youku） |
| category | string | 否 | null | 分类（热血/搞笑/恋爱/玄幻等） |
| sort_by | string | 否 | relevance | 排序方式（relevance/rating/views/update/chapters） |

#### 获取漫画详情
```
GET /api/manga/{manga_id}
```

#### 获取章节列表
```
GET /api/manga/{manga_id}/chapters?page=1&page_size=100
```

#### 获取章节图片
```
GET /api/manga/{manga_id}/chapters/{chapter_id}
```

**响应示例:**
```json
{
  "chapter_id": "manga_001_ch0001",
  "manga_id": "manga_001",
  "title": "第 1 话",
  "pages": [
    {
      "page_number": 1,
      "image_url": "https://manga.example.com/images/manga_001/manga_001_ch0001/001.jpg",
      "width": 800,
      "height": 1200
    }
  ],
  "total_pages": 25,
  "prev_chapter_id": null,
  "next_chapter_id": "manga_001_ch0002",
  "quality": "high",
  "format": "jpg"
}
```

---

## 爬虫架构

### 基类：BaseCrawler

所有爬虫继承自 `BaseCrawler`，提供以下功能：

- 异步 HTTP 请求（aiohttp）
- 统一的错误处理
- 会话管理
- 结果封装

### 具体爬虫

| 爬虫 | 文件 | 功能 |
|------|------|------|
| MusicCrawler | crawlers/music_crawler.py | 音乐搜索、详情、播放链接、歌词 |
| VideoCrawler | crawlers/video_crawler.py | 视频搜索、详情、播放链接、弹幕 |
| NovelCrawler | crawlers/novel_crawler.py | 小说搜索、详情、章节列表、章节内容 |
| MangaCrawler | crawlers/manga_crawler.py | 漫画搜索、详情、章节列表、章节图片 |

### 缓存机制

所有爬虫支持两级缓存：

1. **Redis 缓存**（如果配置）
   - 键格式：`xingju:{type}:{key}`
   - 可配置 TTL（默认 3600 秒）
   
2. **内存缓存**（后备）
   - 使用字典存储
   - 自动过期清理

### 错误处理

- 网络请求自动重试（最多 3 次）
- 指数退避策略
- 统一错误响应格式

```json
{
  "success": false,
  "error": "错误信息",
  "data": null,
  "source": "MusicCrawler"
}
```

---

## 配置选项

### Redis 缓存配置

在初始化爬虫时传入 Redis URL：

```python
crawler = MusicCrawler(redis_url="redis://localhost:6379/0", cache_ttl=7200)
```

### 自定义会话

复用 aiohttp 会话：

```python
async with aiohttp.ClientSession() as session:
    crawler = MusicCrawler(session=session)
    # 使用爬虫
    await crawler.close()
```

---

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "source": "CrawlerName"
}
```

### 错误响应

```json
{
  "success": false,
  "data": null,
  "error": "错误描述",
  "source": "CrawlerName"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 项目结构

```
src/python/
├── main.py                    # FastAPI 主应用
├── requirements.txt           # Python 依赖
├── API_DOCUMENTATION.md       # 本文档
├── api/
│   ├── __init__.py
│   ├── music.py              # 音乐 API
│   ├── video.py              # 视频 API
│   ├── novel.py              # 小说 API
│   └── manga.py              # 漫画 API
├── crawlers/
│   ├── __init__.py
│   ├── base.py               # 爬虫基类
│   ├── music_crawler.py      # 音乐爬虫
│   ├── video_crawler.py      # 视频爬虫
│   ├── novel_crawler.py      # 小说爬虫
│   └── manga_crawler.py      # 漫画爬虫
└── models/
    ├── __init__.py
    └── schemas.py            # 数据模型
```

---

## 代码统计

- **Python 文件**: 14 个
- **总代码行数**: ~2500 行
- **API 端点**: 18 个
- **爬虫类**: 4 个（+ 1 个基类）
- **数据模型**: 15 个 Pydantic 模型

---

## 待扩展功能

1. **真实爬虫接入**
   - 替换模拟数据为真实平台 API
   - 处理反爬策略
   - 添加代理支持

2. **用户系统**
   - 用户认证
   - 收藏和历史记录
   - 个性化推荐

3. **高级搜索**
   - 全文搜索
   - 高级过滤
   - 搜索建议

4. **性能优化**
   - 连接池优化
   - 批量请求
   - CDN 集成

---

## 许可证

本项目仅供学习研究使用。
