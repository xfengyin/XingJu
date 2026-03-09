"""漫画爬虫 - 实现漫画搜索和章节图片获取"""
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


class MangaCrawler(BaseCrawler):
    """漫画爬虫实现
    
    支持多个漫画平台：
    - 哔哩哔哩漫画
    - 腾讯动漫
    - 快看漫画
    - 有妖气
    """
    
    # 模拟数据源
    MOCK_MANGAS = [
        {
            "id": "manga_001",
            "title": "一人之下",
            "author": "米二",
            "description": "随着爷爷尸体被盗，神秘少女冯宝宝的造访，少年张楚岚的平静校园生活被彻底推翻。",
            "cover": "https://example.com/covers/yiren.jpg",
            "source": "tencent",
            "category": "热血",
            "status": "连载中",
            "chapter_count": 678,
            "rating": 4.9,
            "views": 85000000,
            "tags": ["热血", "搞笑", "异能"],
            "last_update": "2024-03-08T10:00:00"
        },
        {
            "id": "manga_002",
            "title": "斗罗大陆",
            "author": "唐家三少/穆逢春",
            "description": "唐门外门弟子唐三穿越到斗罗大陆，凭借前世的记忆和不懈的努力，最终成为斗罗大陆最强者。",
            "cover": "https://example.com/covers/douluo_manga.jpg",
            "source": "tencent",
            "category": "玄幻",
            "status": "连载中",
            "chapter_count": 512,
            "rating": 4.8,
            "views": 92000000,
            "tags": ["玄幻", "热血", "升级"],
            "last_update": "2024-03-07T12:00:00"
        },
        {
            "id": "manga_003",
            "title": "斗破苍穹",
            "author": "天蚕土豆/任翔",
            "description": "天才少年萧炎成为废人后，凭借自己的努力和机缘，重新踏上修炼之路，最终成为斗帝。",
            "cover": "https://example.com/covers/doupo_manga.jpg",
            "source": "tencent",
            "category": "玄幻",
            "status": "连载中",
            "chapter_count": 423,
            "rating": 4.7,
            "views": 78000000,
            "tags": ["玄幻", "热血", "升级"],
            "last_update": "2024-03-06T14:00:00"
        },
        {
            "id": "manga_004",
            "title": "刺客伍六七",
            "author": "何小疯",
            "description": "失忆的刺客伍六七在小鸡岛开理发店，同时接受各种刺杀任务，引发了一系列搞笑故事。",
            "cover": "https://example.com/covers/wuliuqi.jpg",
            "source": "bilibili",
            "category": "搞笑",
            "status": "连载中",
            "chapter_count": 256,
            "rating": 4.9,
            "views": 65000000,
            "tags": ["搞笑", "刺客", "日常"],
            "last_update": "2024-03-05T16:00:00"
        },
        {
            "id": "manga_005",
            "title": "全职高手",
            "author": "蝴蝶蓝/常盘勇者",
            "description": "职业电竞选手叶修被驱逐后，重新投入游戏，带领新战队重返巅峰。",
            "cover": "https://example.com/covers/quanzhi_manga.jpg",
            "source": "tencent",
            "category": "竞技",
            "status": "连载中",
            "chapter_count": 389,
            "rating": 4.8,
            "views": 70000000,
            "tags": ["竞技", "电竞", "热血"],
            "last_update": "2024-03-04T10:00:00"
        },
        {
            "id": "manga_006",
            "title": "狐妖小红娘",
            "author": "庹小新",
            "description": "讲述了以红娘为职业的狐妖，在为前世恋人牵红线过程中发生的一系列有趣、神秘的故事。",
            "cover": "https://example.com/covers/huyao.jpg",
            "source": "tencent",
            "category": "恋爱",
            "status": "连载中",
            "chapter_count": 567,
            "rating": 4.7,
            "views": 82000000,
            "tags": ["恋爱", "奇幻", "古风"],
            "last_update": "2024-03-03T12:00:00"
        },
        {
            "id": "manga_007",
            "title": "镇魂街",
            "author": "许辰",
            "description": "在镇魂街，人灵共存，镇魂将守护着人类，与恶灵战斗。",
            "cover": "https://example.com/covers/zhenhun.jpg",
            "source": "youku",
            "category": "热血",
            "status": "连载中",
            "chapter_count": 412,
            "rating": 4.8,
            "views": 75000000,
            "tags": ["热血", "奇幻", "战斗"],
            "last_update": "2024-03-02T14:00:00"
        },
        {
            "id": "manga_008",
            "title": "快把我哥带走",
            "author": "幽·灵",
            "description": "时秒和时分是一对兄妹，每天上演着让人哭笑不得的日常故事。",
            "cover": "https://example.com/covers/geshi.jpg",
            "source": "kuaikan",
            "category": "日常",
            "status": "完结",
            "chapter_count": 328,
            "rating": 4.6,
            "views": 58000000,
            "tags": ["日常", "搞笑", "兄妹"],
            "last_update": "2023-12-20T00:00:00"
        },
        {
            "id": "manga_009",
            "title": "大王饶命",
            "author": "会说话的肘子/阅动文化",
            "description": "吕树凭借毒鸡汤和收集负面情绪的能力，在灵气复苏的时代成为最强者。",
            "cover": "https://example.com/covers/dawang_manga.jpg",
            "source": "tencent",
            "category": "搞笑",
            "status": "连载中",
            "chapter_count": 298,
            "rating": 4.7,
            "views": 62000000,
            "tags": ["搞笑", "系统", "都市"],
            "last_update": "2024-03-01T10:00:00"
        },
        {
            "id": "manga_010",
            "title": "非人哉",
            "author": "一汪空气",
            "description": "讲述了中国古代神话传说中的神仙妖怪在现代社会中的日常生活。",
            "cover": "https://example.com/covers/feirenzai.jpg",
            "source": "bilibili",
            "category": "搞笑",
            "status": "连载中",
            "chapter_count": 789,
            "rating": 4.8,
            "views": 68000000,
            "tags": ["搞笑", "神话", "日常"],
            "last_update": "2024-03-08T08:00:00"
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
                data = await redis.get(f"xingju:manga:{key}")
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
                    f"xingju:manga:{key}",
                    self.cache_ttl,
                    json.dumps(value)
                )
            except Exception:
                pass
        
        self._cache[key] = value
        self._cache_times[key] = time.time()
    
    def _filter_mangas(self, mangas: List[Dict], query: str, source: Optional[str] = None, category: Optional[str] = None) -> List[Dict]:
        filtered = []
        query_lower = query.lower()
        
        for manga in mangas:
            if query_lower not in manga["title"].lower() and \
               query_lower not in manga.get("author", "").lower() and \
               query_lower not in manga.get("description", "").lower():
                continue
            
            if source and manga["source"] != source:
                continue
            
            if category and manga.get("category") != category:
                continue
            
            filtered.append(manga)
        
        return filtered
    
    def _sort_mangas(self, mangas: List[Dict], sort_by: str = "relevance") -> List[Dict]:
        if sort_by == "rating":
            return sorted(mangas, key=lambda x: x.get("rating", 0), reverse=True)
        elif sort_by == "views":
            return sorted(mangas, key=lambda x: x.get("views", 0), reverse=True)
        elif sort_by == "update":
            return sorted(mangas, key=lambda x: x.get("last_update", ""), reverse=True)
        elif sort_by == "chapters":
            return sorted(mangas, key=lambda x: x.get("chapter_count", 0), reverse=True)
        else:
            return mangas
    
    def _generate_chapters(self, manga_id: str, total: int) -> List[Dict]:
        """生成章节列表"""
        chapters = []
        for i in range(1, min(total + 1, 101)):  # 最多返回 100 章
            chapter = {
                "id": f"{manga_id}_ch{i:04d}",
                "title": f"第{i}话",
                "number": i,
                "page_count": random.randint(15, 30),
                "publish_date": datetime.now().isoformat()
            }
            chapters.append(chapter)
        return chapters
    
    def _generate_chapter_images(self, manga_id: str, chapter_id: str, page_count: int) -> List[Dict]:
        """生成章节图片"""
        pages = []
        for i in range(1, page_count + 1):
            page = {
                "page_number": i,
                "image_url": f"https://manga.example.com/images/{manga_id}/{chapter_id}/{i:03d}.jpg",
                "width": 800,
                "height": 1200
            }
            pages.append(page)
        return pages
    
    async def search(
        self,
        query: str,
        page: int = 1,
        page_size: int = 20,
        source: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "relevance"
    ) -> CrawlerResult:
        """搜索漫画
        
        Args:
            query: 搜索关键词
            page: 页码
            page_size: 每页数量
            source: 指定来源平台
            category: 分类筛选
            sort_by: 排序方式 (relevance/rating/views/update/chapters)
            
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
            
            filtered = self._filter_mangas(self.MOCK_MANGAS, query, source, category)
            sorted_mangas = self._sort_mangas(filtered, sort_by)
            
            total = len(sorted_mangas)
            start = (page - 1) * page_size
            end = start + page_size
            paginated = sorted_mangas[start:end]
            
            result_data = {
                "mangas": paginated,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_detail(self, manga_id: str) -> CrawlerResult:
        """获取漫画详情
        
        Args:
            manga_id: 漫画 ID
            
        Returns:
            CrawlerResult: 漫画详情
        """
        try:
            cache_key = self._generate_cache_key("detail", manga_id=manga_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            for manga in self.MOCK_MANGAS:
                if manga["id"] == manga_id:
                    detail = manga.copy()
                    detail["similar_mangas"] = [
                        m["id"] for m in self.MOCK_MANGAS[:3] if m["id"] != manga_id
                    ]
                    detail["comments_count"] = random.randint(1000, 50000)
                    detail["favorites"] = random.randint(10000, 500000)
                    detail["weekly_views"] = random.randint(100000, 1000000)
                    
                    await self._set_cache(cache_key, detail)
                    
                    return self._create_result(success=True, data=detail)
            
            return self._create_result(success=False, error="漫画不存在")
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_url(self, manga_id: str) -> CrawlerResult:
        """获取漫画链接
        
        Args:
            manga_id: 漫画 ID
            
        Returns:
            CrawlerResult: 漫画链接
        """
        try:
            cache_key = self._generate_cache_key("url", manga_id=manga_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            manga = None
            for m in self.MOCK_MANGAS:
                if m["id"] == manga_id:
                    manga = m
                    break
            
            if not manga:
                return self._create_result(success=False, error="漫画不存在")
            
            url_data = {
                "manga_id": manga_id,
                "url": f"https://manga.example.com/book/{manga_id}",
                "source": manga["source"],
                "source_url": f"https://{manga['source']}.com/manga/{manga_id}"
            }
            
            await self._set_cache(cache_key, url_data)
            
            return self._create_result(success=True, data=url_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_chapters(
        self,
        manga_id: str,
        page: int = 1,
        page_size: int = 100
    ) -> CrawlerResult:
        """获取章节列表
        
        Args:
            manga_id: 漫画 ID
            page: 页码
            page_size: 每页数量
            
        Returns:
            CrawlerResult: 章节列表
        """
        try:
            cache_key = self._generate_cache_key(
                "chapters", manga_id=manga_id, page=page, page_size=page_size
            )
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # 验证漫画存在
            manga = None
            for m in self.MOCK_MANGAS:
                if m["id"] == manga_id:
                    manga = m
                    break
            
            if not manga:
                return self._create_result(success=False, error="漫画不存在")
            
            # 生成章节
            total_chapters = manga.get("chapter_count", 100)
            all_chapters = self._generate_chapters(manga_id, total_chapters)
            
            # 分页
            total = len(all_chapters)
            start = (page - 1) * page_size
            end = start + page_size
            paginated = all_chapters[start:end]
            
            result_data = {
                "chapters": paginated,
                "total": total,
                "page": page,
                "page_size": page_size,
                "manga_id": manga_id,
                "manga_title": manga["title"]
            }
            
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_chapter_images(
        self,
        manga_id: str,
        chapter_id: str
    ) -> CrawlerResult:
        """获取章节图片
        
        Args:
            manga_id: 漫画 ID
            chapter_id: 章节 ID
            
        Returns:
            CrawlerResult: 图片列表
        """
        try:
            cache_key = self._generate_cache_key(
                "images", manga_id=manga_id, chapter_id=chapter_id
            )
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.2, 0.4))
            
            # 验证漫画存在
            manga = None
            for m in self.MOCK_MANGAS:
                if m["id"] == manga_id:
                    manga = m
                    break
            
            if not manga:
                return self._create_result(success=False, error="漫画不存在")
            
            # 解析章节号
            try:
                chapter_num = int(chapter_id.split("_ch")[-1])
            except (ValueError, IndexError):
                chapter_num = 1
            
            # 生成章节信息
            page_count = random.randint(15, 30)
            pages = self._generate_chapter_images(manga_id, chapter_id, page_count)
            
            # 获取前后章节
            prev_chapter = f"{manga_id}_ch{chapter_num - 1:04d}" if chapter_num > 1 else None
            next_chapter = f"{manga_id}_ch{chapter_num + 1:04d}" if chapter_num < manga.get("chapter_count", 100) else None
            
            images_data = {
                "chapter_id": chapter_id,
                "manga_id": manga_id,
                "title": f"第{chapter_num}话",
                "pages": pages,
                "total_pages": page_count,
                "prev_chapter_id": prev_chapter,
                "next_chapter_id": next_chapter,
                "quality": "high",
                "format": "jpg"
            }
            
            await self._set_cache(cache_key, images_data)
            
            return self._create_result(success=True, data=images_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def close(self):
        if self._redis:
            await self._redis.close()
            self._redis = None
        
        await super().close()
