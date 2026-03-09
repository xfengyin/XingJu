"""音乐爬虫 - 实现音乐搜索和播放链接获取"""
import asyncio
import random
import time
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import hashlib
import json

import aiohttp
from crawlers.base import BaseCrawler, CrawlerResult

# 尝试导入 redis，如果不存在则使用内存缓存
try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


class MusicCrawler(BaseCrawler):
    """音乐爬虫实现
    
    支持多个音乐平台：
    - 网易云音乐
    - QQ 音乐
    - 酷狗音乐
    - 咪咕音乐
    """
    
    # 模拟数据源
    MOCK_SONGS = [
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
        },
        {
            "id": "song_002",
            "title": "七里香",
            "artist": "周杰伦",
            "album": "七里香",
            "duration": 299,
            "cover": "https://example.com/covers/qilixiang.jpg",
            "source": "netease",
            "rating": 4.8,
            "views": 950000
        },
        {
            "id": "song_003",
            "title": "告白气球",
            "artist": "周杰伦",
            "album": "周杰伦的床边故事",
            "duration": 215,
            "cover": "https://example.com/covers/gaobaiqiqiu.jpg",
            "source": "qq",
            "rating": 4.7,
            "views": 880000
        },
        {
            "id": "song_004",
            "title": "起风了",
            "artist": "买辣椒也用券",
            "album": "起风了",
            "duration": 325,
            "cover": "https://example.com/covers/qifengle.jpg",
            "source": "netease",
            "rating": 4.9,
            "views": 1200000
        },
        {
            "id": "song_005",
            "title": "光年之外",
            "artist": "邓紫棋",
            "album": "光年之外",
            "duration": 235,
            "cover": "https://example.com/covers/guangnianzhiwai.jpg",
            "source": "qq",
            "rating": 4.8,
            "views": 920000
        },
        {
            "id": "song_006",
            "title": "孤勇者",
            "artist": "陈奕迅",
            "album": "孤勇者",
            "duration": 263,
            "cover": "https://example.com/covers/guyongzhe.jpg",
            "source": "netease",
            "rating": 4.9,
            "views": 1500000
        },
        {
            "id": "song_007",
            "title": "本草纲目",
            "artist": "周杰伦",
            "album": "依然范特西",
            "duration": 213,
            "cover": "https://example.com/covers/bencaogangmu.jpg",
            "source": "qq",
            "rating": 4.7,
            "views": 780000
        },
        {
            "id": "song_008",
            "title": "稻香",
            "artist": "周杰伦",
            "album": "魔杰座",
            "duration": 223,
            "cover": "https://example.com/covers/daoxiang.jpg",
            "source": "netease",
            "rating": 4.9,
            "views": 1100000
        },
        {
            "id": "song_009",
            "title": "青花瓷",
            "artist": "周杰伦",
            "album": "我很忙",
            "duration": 239,
            "cover": "https://example.com/covers/qinghuaci.jpg",
            "source": "qq",
            "rating": 4.9,
            "views": 1050000
        },
        {
            "id": "song_010",
            "title": "说好不哭",
            "artist": "周杰伦",
            "album": "说好不哭",
            "duration": 283,
            "cover": "https://example.com/covers/shuohaobuku.jpg",
            "source": "qq",
            "rating": 4.6,
            "views": 850000
        }
    ]
    
    def __init__(
        self,
        session: Optional[aiohttp.ClientSession] = None,
        redis_url: Optional[str] = None,
        cache_ttl: int = 3600
    ):
        """初始化音乐爬虫
        
        Args:
            session: aiohttp 会话
            redis_url: Redis 连接 URL，如 "redis://localhost:6379/0"
            cache_ttl: 缓存过期时间（秒），默认 1 小时
        """
        super().__init__(session)
        self.redis_url = redis_url
        self.cache_ttl = cache_ttl
        self._redis: Optional[aioredis.Redis] = None
        self._cache: Dict[str, Dict[str, Any]] = {}  # 内存缓存后备
        self._cache_times: Dict[str, float] = {}
    
    async def _get_redis(self) -> Optional[aioredis.Redis]:
        """获取 Redis 连接"""
        if not REDIS_AVAILABLE or not self.redis_url:
            return None
        
        if self._redis is None:
            try:
                self._redis = await aioredis.from_url(
                    self.redis_url,
                    encoding="utf-8",
                    decode_responses=True
                )
            except Exception:
                pass
        
        return self._redis
    
    def _generate_cache_key(self, key_type: str, **kwargs) -> str:
        """生成缓存键"""
        key_str = f"{key_type}:" + ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()))
        return hashlib.md5(key_str.encode()).hexdigest()
    
    async def _get_cache(self, key: str) -> Optional[Any]:
        """从缓存获取数据"""
        # 尝试 Redis
        redis = await self._get_redis()
        if redis:
            try:
                data = await redis.get(f"xingju:music:{key}")
                if data:
                    return json.loads(data)
            except Exception:
                pass
        
        # 尝试内存缓存
        if key in self._cache:
            cache_time = self._cache_times.get(key, 0)
            if time.time() - cache_time < self.cache_ttl:
                return self._cache[key]
            else:
                # 过期清理
                del self._cache[key]
                if key in self._cache_times:
                    del self._cache_times[key]
        
        return None
    
    async def _set_cache(self, key: str, value: Any):
        """设置缓存"""
        # 写入 Redis
        redis = await self._get_redis()
        if redis:
            try:
                await redis.setex(
                    f"xingju:music:{key}",
                    self.cache_ttl,
                    json.dumps(value)
                )
            except Exception:
                pass
        
        # 写入内存缓存
        self._cache[key] = value
        self._cache_times[key] = time.time()
    
    async def _request_with_retry(
        self,
        method: str,
        url: str,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        **kwargs
    ) -> Optional[Dict[str, Any]]:
        """带重试的 HTTP 请求
        
        Args:
            method: HTTP 方法
            url: 请求 URL
            max_retries: 最大重试次数
            retry_delay: 重试延迟（秒）
            **kwargs: 传递给 aiohttp.request 的参数
            
        Returns:
            响应 JSON 数据，失败返回 None
        """
        session = await self.get_session()
        
        for attempt in range(max_retries):
            try:
                async with session.request(method, url, **kwargs) as response:
                    if response.status == 200:
                        return await response.json()
                    elif response.status == 429:  # 速率限制
                        retry_after = response.headers.get('Retry-After', retry_delay)
                        await asyncio.sleep(float(retry_after))
                        continue
                    elif response.status >= 500:  # 服务器错误，重试
                        await asyncio.sleep(retry_delay * (attempt + 1))
                        continue
                    else:
                        return None
            except asyncio.TimeoutError:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
                continue
            except Exception:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (attempt + 1))
                continue
        
        return None
    
    def _filter_songs(self, songs: List[Dict], query: str, source: Optional[str] = None) -> List[Dict]:
        """过滤歌曲列表"""
        filtered = []
        query_lower = query.lower()
        
        for song in songs:
            # 关键词匹配
            if query_lower not in song["title"].lower() and \
               query_lower not in song["artist"].lower():
                continue
            
            # 来源过滤
            if source and song["source"] != source:
                continue
            
            filtered.append(song)
        
        return filtered
    
    def _sort_songs(self, songs: List[Dict], sort_by: str = "relevance") -> List[Dict]:
        """排序歌曲列表"""
        if sort_by == "rating":
            return sorted(songs, key=lambda x: x.get("rating", 0), reverse=True)
        elif sort_by == "views":
            return sorted(songs, key=lambda x: x.get("views", 0), reverse=True)
        elif sort_by == "duration":
            return sorted(songs, key=lambda x: x.get("duration", 0))
        else:  # relevance
            return songs
    
    async def search(
        self,
        query: str,
        page: int = 1,
        page_size: int = 20,
        source: Optional[str] = None,
        sort_by: str = "relevance"
    ) -> CrawlerResult:
        """搜索音乐
        
        Args:
            query: 搜索关键词
            page: 页码
            page_size: 每页数量
            source: 指定来源平台
            sort_by: 排序方式 (relevance/rating/views/duration)
            
        Returns:
            CrawlerResult: 搜索结果
        """
        try:
            # 检查缓存
            cache_key = self._generate_cache_key("search", query=query, source=source, sort_by=sort_by)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            # 模拟网络延迟
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # 过滤和排序
            filtered = self._filter_songs(self.MOCK_SONGS, query, source)
            sorted_songs = self._sort_songs(filtered, sort_by)
            
            # 分页
            total = len(sorted_songs)
            start = (page - 1) * page_size
            end = start + page_size
            paginated = sorted_songs[start:end]
            
            result_data = {
                "songs": paginated,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
            # 缓存结果
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_detail(self, song_id: str) -> CrawlerResult:
        """获取歌曲详情
        
        Args:
            song_id: 歌曲 ID
            
        Returns:
            CrawlerResult: 歌曲详情
        """
        try:
            # 检查缓存
            cache_key = self._generate_cache_key("detail", song_id=song_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            # 模拟网络延迟
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            # 查找歌曲
            for song in self.MOCK_SONGS:
                if song["id"] == song_id:
                    # 添加歌词信息
                    detail = song.copy()
                    detail["lyric"] = f"[00:00.00] {song['title']}\n[00:01.00] {song['artist']}\n..."
                    detail["extra"] = {
                        "bitrate": 320,
                        "format": "mp3",
                        "size_mb": round(song["duration"] * 320 / 8 / 1024 / 1024, 2)
                    }
                    
                    # 缓存
                    await self._set_cache(cache_key, detail)
                    
                    return self._create_result(success=True, data=detail)
            
            return self._create_result(success=False, error="歌曲不存在")
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_url(
        self,
        song_id: str,
        quality: str = "standard"
    ) -> CrawlerResult:
        """获取播放链接
        
        Args:
            song_id: 歌曲 ID
            quality: 音质 (standard/high/lossless)
            
        Returns:
            CrawlerResult: 播放链接
        """
        try:
            # 检查缓存
            cache_key = self._generate_cache_key("url", song_id=song_id, quality=quality)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            # 模拟网络延迟
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            # 验证歌曲存在
            song = None
            for s in self.MOCK_SONGS:
                if s["id"] == song_id:
                    song = s
                    break
            
            if not song:
                return self._create_result(success=False, error="歌曲不存在")
            
            # 生成播放链接（模拟）
            quality_map = {
                "standard": {"bitrate": 128, "suffix": "128k"},
                "high": {"bitrate": 320, "suffix": "320k"},
                "lossless": {"bitrate": 1411, "suffix": "flac"}
            }
            
            q_info = quality_map.get(quality, quality_map["standard"])
            expires = datetime.now() + timedelta(hours=24)
            
            url_data = {
                "song_id": song_id,
                "url": f"https://music.example.com/play/{song_id}.{q_info['suffix']}",
                "quality": quality,
                "bitrate": q_info["bitrate"],
                "format": "flac" if quality == "lossless" else "mp3",
                "expires": expires.isoformat(),
                "size_mb": round(song["duration"] * q_info["bitrate"] / 8 / 1024 / 1024, 2)
            }
            
            # 缓存链接（较短的 TTL）
            await self._set_cache(cache_key, url_data)
            
            return self._create_result(success=True, data=url_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_lyric(self, song_id: str) -> CrawlerResult:
        """获取歌词
        
        Args:
            song_id: 歌曲 ID
            
        Returns:
            CrawlerResult: 歌词内容
        """
        try:
            # 检查缓存
            cache_key = self._generate_cache_key("lyric", song_id=song_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            # 模拟网络延迟
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            # 查找歌曲
            for song in self.MOCK_SONGS:
                if song["id"] == song_id:
                    # 生成模拟歌词
                    lyric_lines = [
                        f"[00:00.00] {song['title']}",
                        f"[00:01.00] {song['artist']}",
                        f"[00:02.00] Album: {song.get('album', 'Unknown')}",
                        "",
                        "[00:10.00] (Verse 1)",
                        "[00:15.00] 这里是歌词内容...",
                        "[00:20.00] 继续歌词...",
                        "",
                        "[00:30.00] (Chorus)",
                        "[00:35.00] 副歌部分...",
                        "[00:40.00] 继续副歌...",
                        "",
                        "[01:00.00] (End)"
                    ]
                    
                    lyric_data = {
                        "song_id": song_id,
                        "title": song["title"],
                        "artist": song["artist"],
                        "lyric": "\n".join(lyric_lines),
                        "has_translation": False,
                        "language": "zh"
                    }
                    
                    # 缓存
                    await self._set_cache(cache_key, lyric_data)
                    
                    return self._create_result(success=True, data=lyric_data)
            
            return self._create_result(success=False, error="歌曲不存在")
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def close(self):
        """关闭资源"""
        if self._redis:
            await self._redis.close()
            self._redis = None
        
        await super().close()
