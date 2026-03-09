# XingJu API Documentation

星聚多元内容聚合工具 API 接口文档 | XingJu Multi-Content Aggregation Tool API Documentation

---

## 音乐 API | Music API

### GET /api/music/search - 搜索音乐 | Search Music

搜索音乐内容 | Search for music content

**请求参数 | Request Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |
| source | string | 否 | 音乐源：netease/qq/kuwo，默认 netease |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "tracks": [
      {
        "id": "music_001",
        "title": "歌曲名称",
        "artist": "艺术家",
        "album": "专辑名",
        "duration": 240,
        "cover": "https://example.com/cover.jpg",
        "source": "netease"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/music/search?q=周杰伦&source=netease"
```

---

### GET /api/music/track/:id - 获取音乐详情 | Get Track Details

获取指定音乐的详细信息 | Get detailed information for a specific track

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 音乐 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "music_001",
    "title": "歌曲名称",
    "artist": "艺术家",
    "album": "专辑名",
    "duration": 240,
    "releaseDate": "2023-01-01",
    "genre": "流行",
    "cover": "https://example.com/cover.jpg",
    "playUrl": "https://cdn.example.com/music/001.mp3",
    "source": "netease"
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/music/track/music_001"
```

---

### GET /api/music/playlist/:id - 获取歌单详情 | Get Playlist Details

获取指定歌单的详细信息 | Get detailed information for a specific playlist

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 歌单 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "playlist_001",
    "name": "经典华语金曲",
    "description": "收藏的经典华语歌曲",
    "cover": "https://example.com/playlist.jpg",
    "trackCount": 100,
    "playCount": 50000,
    "creator": {
      "id": "user_123",
      "name": "用户名称"
    },
    "tracks": [
      {
        "id": "music_001",
        "title": "歌曲名称",
        "artist": "艺术家"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/music/playlist/playlist_001"
```

---

### GET /api/music/artist/:id - 获取歌手详情 | Get Artist Details

获取指定歌手的详细信息和作品列表 | Get detailed information and works for a specific artist

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 歌手 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "artist_001",
    "name": "歌手名称",
    "avatar": "https://example.com/artist.jpg",
    "description": "歌手介绍",
    "albumCount": 10,
    "trackCount": 150,
    "topTracks": [
      {
        "id": "music_001",
        "title": "热门歌曲",
        "playCount": 1000000
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/music/artist/artist_001"
```

---

## 视频 API | Video API

### GET /api/video/search - 搜索视频 | Search Videos

搜索视频内容 | Search for video content

**请求参数 | Request Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |
| source | string | 否 | 视频源：bilibili/youtube，默认 bilibili |
| duration | string | 否 | 时长过滤：short/medium/long |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 200,
    "page": 1,
    "limit": 20,
    "videos": [
      {
        "id": "video_001",
        "title": "视频标题",
        "description": "视频描述",
        "duration": 600,
        "cover": "https://example.com/video_cover.jpg",
        "author": {
          "id": "author_001",
          "name": "UP 主名称"
        },
        "playCount": 100000,
        "source": "bilibili"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/video/search?q=教程&source=bilibili"
```

---

### GET /api/video/:id - 获取视频详情 | Get Video Details

获取指定视频的详细信息 | Get detailed information for a specific video

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 视频 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "video_001",
    "title": "视频标题",
    "description": "视频描述",
    "duration": 600,
    "cover": "https://example.com/video_cover.jpg",
    "playUrl": "https://cdn.example.com/video/001.mp4",
    "author": {
      "id": "author_001",
      "name": "UP 主名称",
      "avatar": "https://example.com/avatar.jpg"
    },
    "playCount": 100000,
    "likeCount": 5000,
    "commentCount": 200,
    "publishDate": "2024-01-01T00:00:00Z",
    "source": "bilibili"
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/video/video_001"
```

---

### GET /api/video/:id/danmaku - 获取弹幕 | Get Danmaku

获取视频的弹幕内容 | Get danmaku (bullet comments) for a video

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 视频 ID |

**查询参数 | Query Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| start | number | 否 | 开始时间 (秒) |
| end | number | 否 | 结束时间 (秒) |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "videoId": "video_001",
    "danmaku": [
      {
        "id": "dm_001",
        "content": "弹幕内容",
        "time": 10.5,
        "type": "scroll",
        "color": "#FFFFFF"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/video/video_001/danmaku?start=0&end=60"
```

---

### GET /api/video/channel/:id - 获取频道详情 | Get Channel Details

获取视频频道/UP 主的详细信息 | Get detailed information for a video channel/creator

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 频道 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "channel_001",
    "name": "频道名称",
    "avatar": "https://example.com/channel.jpg",
    "description": "频道介绍",
    "subscriberCount": 50000,
    "videoCount": 200,
    "totalViews": 10000000,
    "latestVideos": [
      {
        "id": "video_001",
        "title": "最新视频",
        "cover": "https://example.com/cover.jpg"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/video/channel/channel_001"
```

---

## 小说 API | Novel API

### GET /api/novel/search - 搜索小说 | Search Novels

搜索小说内容 | Search for novel content

**请求参数 | Request Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |
| category | string | 否 | 分类：玄幻/都市/历史等 |
| status | string | 否 | 状态：ongoing/completed |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 300,
    "page": 1,
    "limit": 20,
    "novels": [
      {
        "id": "novel_001",
        "title": "小说标题",
        "author": "作者名",
        "cover": "https://example.com/novel_cover.jpg",
        "category": "玄幻",
        "status": "ongoing",
        "chapterCount": 500,
        "description": "小说简介",
        "rating": 4.5
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/novel/search?q=修仙&category=玄幻"
```

---

### GET /api/novel/:id - 获取小说详情 | Get Novel Details

获取指定小说的详细信息 | Get detailed information for a specific novel

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 小说 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "novel_001",
    "title": "小说标题",
    "author": "作者名",
    "cover": "https://example.com/novel_cover.jpg",
    "category": "玄幻",
    "status": "ongoing",
    "chapterCount": 500,
    "description": "小说简介",
    "rating": 4.5,
    "viewCount": 1000000,
    "bookmarkCount": 50000,
    "lastUpdate": "2024-03-09T10:00:00Z",
    "chapters": [
      {
        "id": "chapter_001",
        "title": "第一章 开始",
        "number": 1,
        "updateTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/novel/novel_001"
```

---

### GET /api/novel/:id/chapter/:chapterId - 获取章节内容 | Get Chapter Content

获取指定章节的正文内容 | Get the content of a specific chapter

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 小说 ID |
| chapterId | string | 章节 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "novelId": "novel_001",
    "chapterId": "chapter_001",
    "title": "第一章 开始",
    "number": 1,
    "content": "这里是章节正文内容...\n\n段落 1\n\n段落 2",
    "previousChapter": null,
    "nextChapter": "chapter_002",
    "wordCount": 3000,
    "publishTime": "2024-01-01T00:00:00Z"
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/novel/novel_001/chapter/chapter_001"
```

---

### GET /api/novel/author/:id - 获取作者详情 | Get Author Details

获取指定作者的详细信息和作品列表 | Get detailed information and works for a specific author

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 作者 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "author_001",
    "name": "作者名",
    "avatar": "https://example.com/author.jpg",
    "description": "作者介绍",
    "workCount": 5,
    "totalWords": 5000000,
    "followerCount": 100000,
    "works": [
      {
        "id": "novel_001",
        "title": "代表作品",
        "status": "ongoing",
        "rating": 4.5
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/novel/author/author_001"
```

---

### GET /api/novel/category - 获取分类列表 | Get Categories

获取小说分类列表 | Get the list of novel categories

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "玄幻",
        "count": 10000
      },
      {
        "id": "cat_002",
        "name": "都市",
        "count": 8000
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/novel/category"
```

---

## 漫画 API | Comic API

### GET /api/comic/search - 搜索漫画 | Search Comics

搜索漫画内容 | Search for comic content

**请求参数 | Request Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |
| category | string | 否 | 分类：热血/恋爱/搞笑等 |
| status | string | 否 | 状态：ongoing/completed |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 250,
    "page": 1,
    "limit": 20,
    "comics": [
      {
        "id": "comic_001",
        "title": "漫画标题",
        "author": "作者名",
        "cover": "https://example.com/comic_cover.jpg",
        "category": "热血",
        "status": "ongoing",
        "chapterCount": 100,
        "description": "漫画简介",
        "rating": 4.8
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/comic/search?q=冒险&category=热血"
```

---

### GET /api/comic/:id - 获取漫画详情 | Get Comic Details

获取指定漫画的详细信息 | Get detailed information for a specific comic

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 漫画 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "comic_001",
    "title": "漫画标题",
    "author": "作者名",
    "cover": "https://example.com/comic_cover.jpg",
    "category": "热血",
    "status": "ongoing",
    "chapterCount": 100,
    "description": "漫画简介",
    "rating": 4.8,
    "viewCount": 500000,
    "bookmarkCount": 30000,
    "lastUpdate": "2024-03-09T10:00:00Z",
    "chapters": [
      {
        "id": "chapter_001",
        "title": "第 1 话 开始",
        "number": 1,
        "updateTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/comic/comic_001"
```

---

### GET /api/comic/:id/chapter/:chapterId - 获取章节图片 | Get Chapter Images

获取指定章节的漫画图片列表 | Get the list of images for a specific chapter

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 漫画 ID |
| chapterId | string | 章节 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "comicId": "comic_001",
    "chapterId": "chapter_001",
    "title": "第 1 话 开始",
    "number": 1,
    "images": [
      {
        "index": 1,
        "url": "https://cdn.example.com/comic/001/001.jpg",
        "width": 800,
        "height": 1200
      },
      {
        "index": 2,
        "url": "https://cdn.example.com/comic/001/002.jpg",
        "width": 800,
        "height": 1200
      }
    ],
    "previousChapter": null,
    "nextChapter": "chapter_002"
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/comic/comic_001/chapter/chapter_001"
```

---

### GET /api/comic/author/:id - 获取作者详情 | Get Author Details

获取指定漫画作者的详细信息和作品列表 | Get detailed information and works for a specific comic author

**路径参数 | Path Parameters:**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 作者 ID |

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "author_001",
    "name": "作者名",
    "avatar": "https://example.com/author.jpg",
    "description": "作者介绍",
    "workCount": 3,
    "followerCount": 50000,
    "works": [
      {
        "id": "comic_001",
        "title": "代表作品",
        "status": "ongoing",
        "rating": 4.8
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/comic/author/author_001"
```

---

### GET /api/comic/category - 获取分类列表 | Get Categories

获取漫画分类列表 | Get the list of comic categories

**响应格式 | Response Format:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "热血",
        "count": 5000
      },
      {
        "id": "cat_002",
        "name": "恋爱",
        "count": 4000
      },
      {
        "id": "cat_003",
        "name": "搞笑",
        "count": 3500
      }
    ]
  }
}
```

**示例请求 | Example Request:**

```bash
curl -X GET "http://localhost:4000/api/comic/category"
```

---

## 错误码 | Error Codes

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

**错误响应格式 | Error Response Format:**

```json
{
  "code": 404,
  "message": "Resource not found",
  "data": null
}
```

---

## 认证 | Authentication

大部分 API 需要在请求头中携带认证信息 | Most APIs require authentication in the request header

**请求头 | Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 速率限制 | Rate Limiting

API 有速率限制 | APIs have rate limits:

- 普通用户：100 请求/分钟
- VIP 用户：500 请求/分钟

**响应头 | Response Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709971200
```

---

*最后更新 | Last Updated: 2024-03-09*
