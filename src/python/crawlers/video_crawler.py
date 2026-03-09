"""视频爬虫 - 实现视频搜索和播放链接获取"""
import asyncio
import random
import time
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import hashlib
import json

import aiohttp
from crawlers.base import BaseCrawler, CrawlerResult

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


class VideoCrawler(BaseCrawler):
    """视频爬虫实现
    
    支持多个视频平台：
    - 哔哩哔哩
    - 腾讯视频
    - 爱奇艺
    - 优酷
    """
    
    # 模拟数据源
    MOCK_VIDEOS = [
        {
            "id": "video_001",
            "title": "【官方】2024 年最新科技发布会全程回放",
            "description": "2024 年度科技盛会，最新产品发布",
            "cover": "https://example.com/covers/tech2024.jpg",
            "duration": 7200,
            "source": "bilibili",
            "author": "科技前沿",
            "views": 2500000,
            "rating": 4.9,
            "tags": ["科技", "发布会", "2024"],
            "publish_date": "2024-03-01T10:00:00"
        },
        {
            "id": "video_002",
            "title": "Python 从入门到精通 - 全套教程",
            "description": "适合初学者的 Python 编程教程",
            "cover": "https://example.com/covers/python_tutorial.jpg",
            "duration": 36000,
            "source": "bilibili",
            "author": "编程学院",
            "views": 1800000,
            "rating": 4.8,
            "tags": ["编程", "Python", "教程"],
            "publish_date": "2024-01-15T08:00:00"
        },
        {
            "id": "video_003",
            "title": "美食纪录片：舌尖上的中国 第四季",
            "description": "探索中国各地美食文化",
            "cover": "https://example.com/covers/food_doc.jpg",
            "duration": 3000,
            "source": "tencent",
            "author": "CCTV",
            "views": 5000000,
            "rating": 4.9,
            "tags": ["美食", "纪录片", "中国"],
            "publish_date": "2024-02-10T20:00:00"
        },
        {
            "id": "video_004",
            "title": "NBA 总决赛 G7 全场集锦",
            "description": "精彩绝伦的抢七大战",
            "cover": "https://example.com/covers/nba_finals.jpg",
            "duration": 600,
            "source": "iqiyi",
            "author": "体育频道",
            "views": 3200000,
            "rating": 4.7,
            "tags": ["体育", "NBA", "篮球"],
            "publish_date": "2024-06-20T10:30:00"
        },
        {
            "id": "video_005",
            "title": "电影解说：《星际穿越》深度解析",
            "description": "诺兰经典科幻电影详解",
            "cover": "https://example.com/covers/interstellar.jpg",
            "duration": 1800,
            "source": "bilibili",
            "author": "电影实验室",
            "views": 1500000,
            "rating": 4.8,
            "tags": ["电影", "科幻", "解说"],
            "publish_date": "2024-02-28T18:00:00"
        },
        {
            "id": "video_006",
            "title": "旅行 Vlog：日本京都七日行",
            "description": "带你领略京都的美丽风光",
            "cover": "https://example.com/covers/kyoto.jpg",
            "duration": 2400,
            "source": "youku",
            "author": "旅行家小明",
            "views": 980000,
            "rating": 4.6,
            "tags": ["旅行", "日本", "Vlog"],
            "publish_date": "2024-03-05T12:00:00"
        },
        {
            "id": "video_007",
            "title": "音乐现场：周杰伦 2024 演唱会",
            "description": "周杰伦巡回演唱会上海站",
            "cover": "https://example.com/covers/jay_concert.jpg",
            "duration": 9000,
            "source": "tencent",
            "author": "杰威尔音乐",
            "views": 4500000,
            "rating": 4.9,
            "tags": ["音乐", "演唱会", "周杰伦"],
            "publish_date": "2024-01-20T19:30:00"
        },
        {
            "id": "video_008",
            "title": "游戏实况：艾尔登法环 全流程攻略",
            "description": "魂系游戏巅峰之作完整攻略",
            "cover": "https://example.com/covers/elden_ring.jpg",
            "duration": 28800,
            "source": "bilibili",
            "author": "游戏老司機",
            "views": 2100000,
            "rating": 4.8,
            "tags": ["游戏", "攻略", "艾尔登法环"],
            "publish_date": "2024-02-01T14:00:00"
        },
        {
            "id": "video_009",
            "title": "科普：黑洞是如何形成的？",
            "description": "探索宇宙中最神秘的天体",
            "cover": "https://example.com/covers/blackhole.jpg",
            "duration": 900,
            "source": "iqiyi",
            "author": "宇宙科普",
            "views": 1200000,
            "rating": 4.7,
            "tags": ["科普", "宇宙", "黑洞"],
            "publish_date": "2024-03-08T16:00:00"
        },
        {
            "id": "video_010",
            "title": "健身教程：30 天腹肌训练计划",
            "description": "在家也能练出完美腹肌",
            "cover": "https://example.com/covers/fitness.jpg",
            "duration": 1200,
            "source": "bilibili",
            "author": "健身达人",
            "views": 1600000,
            "rating": 4.6,
            "tags": ["健身", "教程", "腹肌"],
            "publish_date": "2024-01-10T07:00:00"
        }
    ]
    
    def __init__(
        self,
        session: Optional[aiohttp.ClientSession] = None,
        redis_url: Optional[str] = None,
        cache_ttl: int = 3600
    ):
        super().__init__(session)
        self.redis_url = redis_url
        self.cache_ttl = cache_ttl
        self._redis: Optional[aioredis.Redis] = None
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_times: Dict[str, float] = {}
    
    async def _get_redis(self) -> Optional[aioredis.Redis]:
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
        key_str = f"{key_type}:" + ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()))
        return hashlib.md5(key_str.encode()).hexdigest()
    
    async def _get_cache(self, key: str) -> Optional[Any]:
        redis = await self._get_redis()
        if redis:
            try:
                data = await redis.get(f"xingju:video:{key}")
                if data:
                    return json.loads(data)
            except Exception:
                pass
        
        if key in self._cache:
            cache_time = self._cache_times.get(key, 0)
            if time.time() - cache_time < self.cache_ttl:
                return self._cache[key]
            else:
                del self._cache[key]
                if key in self._cache_times:
                    del self._cache_times[key]
        
        return None
    
    async def _set_cache(self, key: str, value: Any):
        redis = await self._get_redis()
        if redis:
            try:
                await redis.setex(
                    f"xingju:video:{key}",
                    self.cache_ttl,
                    json.dumps(value)
                )
            except Exception:
                pass
        
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
        session = await self.get_session()
        
        for attempt in range(max_retries):
            try:
                async with session.request(method, url, **kwargs) as response:
                    if response.status == 200:
                        return await response.json()
                    elif response.status == 429:
                        retry_after = response.headers.get('Retry-After', retry_delay)
                        await asyncio.sleep(float(retry_after))
                        continue
                    elif response.status >= 500:
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
    
    def _filter_videos(self, videos: List[Dict], query: str, source: Optional[str] = None, category: Optional[str] = None) -> List[Dict]:
        filtered = []
        query_lower = query.lower()
        
        for video in videos:
            if query_lower not in video["title"].lower() and \
               query_lower not in video.get("description", "").lower() and \
               query_lower not in video.get("author", "").lower():
                continue
            
            if source and video["source"] != source:
                continue
            
            if category and category not in video.get("tags", []):
                continue
            
            filtered.append(video)
        
        return filtered
    
    def _sort_videos(self, videos: List[Dict], sort_by: str = "relevance") -> List[Dict]:
        if sort_by == "rating":
            return sorted(videos, key=lambda x: x.get("rating", 0), reverse=True)
        elif sort_by == "views":
            return sorted(videos, key=lambda x: x.get("views", 0), reverse=True)
        elif sort_by == "duration":
            return sorted(videos, key=lambda x: x.get("duration", 0))
        elif sort_by == "date":
            return sorted(videos, key=lambda x: x.get("publish_date", ""), reverse=True)
        else:
            return videos
    
    async def search(
        self,
        query: str,
        page: int = 1,
        page_size: int = 20,
        source: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "relevance"
    ) -> CrawlerResult:
        """搜索视频
        
        Args:
            query: 搜索关键词
            page: 页码
            page_size: 每页数量
            source: 指定来源平台
            category: 分类筛选
            sort_by: 排序方式 (relevance/rating/views/duration/date)
            
        Returns:
            CrawlerResult: 搜索结果
        """
        try:
            cache_key = self._generate_cache_key(
                "search", query=query, source=source, category=category, sort_by=sort_by
            )
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            filtered = self._filter_videos(self.MOCK_VIDEOS, query, source, category)
            sorted_videos = self._sort_videos(filtered, sort_by)
            
            total = len(sorted_videos)
            start = (page - 1) * page_size
            end = start + page_size
            paginated = sorted_videos[start:end]
            
            result_data = {
                "videos": paginated,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_detail(self, video_id: str) -> CrawlerResult:
        """获取视频详情
        
        Args:
            video_id: 视频 ID
            
        Returns:
            CrawlerResult: 视频详情
        """
        try:
            cache_key = self._generate_cache_key("detail", video_id=video_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            for video in self.MOCK_VIDEOS:
                if video["id"] == video_id:
                    detail = video.copy()
                    detail["related_videos"] = [
                        v["id"] for v in self.MOCK_VIDEOS[:3] if v["id"] != video_id
                    ]
                    detail["comments_count"] = random.randint(100, 10000)
                    detail["likes"] = random.randint(1000, 100000)
                    
                    await self._set_cache(cache_key, detail)
                    
                    return self._create_result(success=True, data=detail)
            
            return self._create_result(success=False, error="视频不存在")
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_url(
        self,
        video_id: str,
        quality: str = "1080p"
    ) -> CrawlerResult:
        """获取播放链接
        
        Args:
            video_id: 视频 ID
            quality: 画质 (360p/480p/720p/1080p/4k)
            
        Returns:
            CrawlerResult: 播放链接
        """
        try:
            cache_key = self._generate_cache_key("url", video_id=video_id, quality=quality)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            video = None
            for v in self.MOCK_VIDEOS:
                if v["id"] == video_id:
                    video = v
                    break
            
            if not video:
                return self._create_result(success=False, error="视频不存在")
            
            quality_map = {
                "360p": {"bitrate": 500, "width": 640, "height": 360},
                "480p": {"bitrate": 1000, "width": 854, "height": 480},
                "720p": {"bitrate": 2500, "width": 1280, "height": 720},
                "1080p": {"bitrate": 5000, "width": 1920, "height": 1080},
                "4k": {"bitrate": 20000, "width": 3840, "height": 2160}
            }
            
            q_info = quality_map.get(quality, quality_map["1080p"])
            expires = datetime.now() + timedelta(hours=12)
            
            url_data = {
                "video_id": video_id,
                "url": f"https://video.example.com/play/{video_id}?q={quality}",
                "quality": quality,
                "format": "mp4",
                "width": q_info["width"],
                "height": q_info["height"],
                "bitrate": q_info["bitrate"],
                "expires": expires.isoformat(),
                "supports_danmaku": True
            }
            
            await self._set_cache(cache_key, url_data)
            
            return self._create_result(success=True, data=url_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_danmaku(self, video_id: str, timestamp: int = 0) -> CrawlerResult:
        """获取弹幕
        
        Args:
            video_id: 视频 ID
            timestamp: 时间戳（秒）
            
        Returns:
            CrawlerResult: 弹幕列表
        """
        try:
            cache_key = self._generate_cache_key("danmaku", video_id=video_id, timestamp=timestamp)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.05, 0.15))
            
            video = None
            for v in self.MOCK_VIDEOS:
                if v["id"] == video_id:
                    video = v
                    break
            
            if not video:
                return self._create_result(success=False, error="视频不存在")
            
            danmaku_data = {
                "video_id": video_id,
                "danmakus": [
                    {
                        "id": f"dm_{i}",
                        "content": f"这是弹幕内容 {i}",
                        "timestamp": random.randint(0, video.get("duration", 300)),
                        "position": random.randint(1, 3),
                        "color": "#FFFFFF",
                        "user": f"user_{random.randint(1000, 9999)}"
                    }
                    for i in range(random.randint(5, 20))
                ],
                "total": random.randint(100, 10000)
            }
            
            await self._set_cache(cache_key, danmaku_data)
            
            return self._create_result(success=True, data=danmaku_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def close(self):
        if self._redis:
            await self._redis.close()
            self._redis = None
        
        await super().close()
