"""小说爬虫 - 实现小说搜索和章节内容获取"""
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


class NovelCrawler(BaseCrawler):
    """小说爬虫实现
    
    支持多个小说平台：
    - 起点中文网
    - 晋江文学城
    - 纵横中文网
    - 17K 小说网
    """
    
    # 模拟数据源
    MOCK_NOVELS = [
        {
            "id": "novel_001",
            "title": "斗破苍穹",
            "author": "天蚕土豆",
            "description": "讲述了天才少年萧炎在创造了家族空前绝后的修炼纪录后突然成了废人，整整三年时间，家族冷遇，旁人轻视，被未婚妻退婚……种种打击接踵而至。",
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
        },
        {
            "id": "novel_002",
            "title": "斗罗大陆",
            "author": "唐家三少",
            "description": "唐门外门弟子唐三，因偷学内门绝学为唐门所不容，跳崖明志时却发现没有死，反而以另外一个身份来到了另一个世界。",
            "cover": "https://example.com/covers/douluo.jpg",
            "source": "qidian",
            "category": "玄幻",
            "status": "完结",
            "word_count": 2980000,
            "chapter_count": 336,
            "rating": 4.7,
            "views": 95000000,
            "tags": ["玄幻", "穿越", "武魂"],
            "last_update": "2023-11-15T00:00:00"
        },
        {
            "id": "novel_003",
            "title": "诡秘之主",
            "author": "爱潜水的乌贼",
            "description": "蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？我从诡秘中醒来，睁眼看见这个世界。",
            "cover": "https://example.com/covers/guimi.jpg",
            "source": "qidian",
            "category": "奇幻",
            "status": "完结",
            "word_count": 4460000,
            "chapter_count": 1394,
            "rating": 4.9,
            "views": 88000000,
            "tags": ["奇幻", "克苏鲁", "蒸汽朋克"],
            "last_update": "2023-10-20T00:00:00"
        },
        {
            "id": "novel_004",
            "title": "大王饶命",
            "author": "会说话的肘子",
            "description": "吕树凭借着毒鸡汤和对负面情绪的收集，在灵气复苏的时代里，一步步成为最强者。",
            "cover": "https://example.com/covers/dawang.jpg",
            "source": "qidian",
            "category": "都市",
            "status": "完结",
            "word_count": 2830000,
            "chapter_count": 1152,
            "rating": 4.6,
            "views": 72000000,
            "tags": ["都市", "搞笑", "系统"],
            "last_update": "2023-09-10T00:00:00"
        },
        {
            "id": "novel_005",
            "title": "凡人修仙传",
            "author": "忘语",
            "description": "一个普通的山村穷小子，偶然之下，跨入到一个江湖小门派，虽然没有被接受为正式弟子，但是凭借自身的努力和算计，最终成为一代修仙祖师。",
            "cover": "https://example.com/covers/fanren.jpg",
            "source": "qidian",
            "category": "仙侠",
            "status": "完结",
            "word_count": 7470000,
            "chapter_count": 2478,
            "rating": 4.8,
            "views": 90000000,
            "tags": ["仙侠", "凡人流", "修仙"],
            "last_update": "2023-08-05T00:00:00"
        },
        {
            "id": "novel_006",
            "title": "全职高手",
            "author": "蝴蝶蓝",
            "description": "网游荣耀中被誉为教科书级别的顶尖高手，因为种种原因遭到俱乐部的驱逐，离开职业圈的他，重新投入游戏怀抱，开启了一段重返巅峰的传奇之路。",
            "cover": "https://example.com/covers/quanzhi.jpg",
            "source": "qidian",
            "category": "游戏",
            "status": "完结",
            "word_count": 5350000,
            "chapter_count": 1729,
            "rating": 4.9,
            "views": 85000000,
            "tags": ["游戏", "电竞", "热血"],
            "last_update": "2023-07-20T00:00:00"
        },
        {
            "id": "novel_007",
            "title": "遮天",
            "author": "辰东",
            "description": "冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺，亘古长存。这是九龙拉棺的传说。",
            "cover": "https://example.com/covers/zhetian.jpg",
            "source": "qidian",
            "category": "仙侠",
            "status": "完结",
            "word_count": 6370000,
            "chapter_count": 1876,
            "rating": 4.7,
            "views": 78000000,
            "tags": ["仙侠", "热血", "宏大"],
            "last_update": "2023-06-15T00:00:00"
        },
        {
            "id": "novel_008",
            "title": "夜的命名术",
            "author": "会说话的肘子",
            "description": "蓝与紫的霓虹中，浓密的钢铁苍穹下，数据洪流的前端，是科技革命之后的世界，也是现实与虚幻的分界。",
            "cover": "https://example.com/covers/yeming.jpg",
            "source": "qidian",
            "category": "科幻",
            "status": "连载中",
            "word_count": 3200000,
            "chapter_count": 1024,
            "rating": 4.8,
            "views": 65000000,
            "tags": ["科幻", "赛博朋克", "群像"],
            "last_update": "2024-03-08T12:00:00"
        },
        {
            "id": "novel_009",
            "title": "万族之劫",
            "author": "老鹰吃小鸡",
            "description": "苏宇穿越到一个万族林立的世界，成为了一名人族学子。在这个人族式微的时代，他要为人族杀出一个未来！",
            "cover": "https://example.com/covers/wanzu.jpg",
            "source": "qidian",
            "category": "玄幻",
            "status": "完结",
            "word_count": 8380000,
            "chapter_count": 1765,
            "rating": 4.6,
            "views": 70000000,
            "tags": ["玄幻", "热血", "万族"],
            "last_update": "2023-05-10T00:00:00"
        },
        {
            "id": "novel_010",
            "title": "大奉打更人",
            "author": "卖报小郎君",
            "description": "这个世界，有儒；有道；有佛；有妖；有术士。警校毕业的许七安幽幽醒来，发现自己身处牢狱之中，三日后流放边陲。",
            "cover": "https://example.com/covers/dafeng.jpg",
            "source": "qidian",
            "category": "仙侠",
            "status": "完结",
            "word_count": 5020000,
            "chapter_count": 1234,
            "rating": 4.8,
            "views": 82000000,
            "tags": ["仙侠", "探案", "搞笑"],
            "last_update": "2023-04-01T00:00:00"
        }
    ]
    
    # 模拟章节内容
    CHAPTER_TEMPLATES = [
        "第一章 开始",
        "第二章 发展",
        "第三章 转折",
        "第四章 高潮",
        "第五章 结局"
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
                data = await redis.get(f"xingju:novel:{key}")
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
                    f"xingju:novel:{key}",
                    self.cache_ttl,
                    json.dumps(value)
                )
            except Exception:
                pass
        
        self._cache[key] = value
        self._cache_times[key] = time.time()
    
    def _filter_novels(self, novels: List[Dict], query: str, source: Optional[str] = None, category: Optional[str] = None) -> List[Dict]:
        filtered = []
        query_lower = query.lower()
        
        for novel in novels:
            if query_lower not in novel["title"].lower() and \
               query_lower not in novel.get("author", "").lower() and \
               query_lower not in novel.get("description", "").lower():
                continue
            
            if source and novel["source"] != source:
                continue
            
            if category and novel.get("category") != category:
                continue
            
            filtered.append(novel)
        
        return filtered
    
    def _sort_novels(self, novels: List[Dict], sort_by: str = "relevance") -> List[Dict]:
        if sort_by == "rating":
            return sorted(novels, key=lambda x: x.get("rating", 0), reverse=True)
        elif sort_by == "views":
            return sorted(novels, key=lambda x: x.get("views", 0), reverse=True)
        elif sort_by == "word_count":
            return sorted(novels, key=lambda x: x.get("word_count", 0), reverse=True)
        elif sort_by == "update":
            return sorted(novels, key=lambda x: x.get("last_update", ""), reverse=True)
        else:
            return novels
    
    def _generate_chapters(self, novel_id: str, total: int) -> List[Dict]:
        """生成章节列表"""
        chapters = []
        for i in range(1, min(total + 1, 101)):  # 最多返回 100 章
            chapter = {
                "id": f"{novel_id}_ch{i:04d}",
                "title": f"第{i}章 {self.CHAPTER_TEMPLATES[(i-1) % len(self.CHAPTER_TEMPLATES)]}",
                "number": i,
                "word_count": random.randint(2000, 5000),
                "is_vip": i > 50,  # 前 50 章免费
                "publish_date": datetime.now().isoformat()
            }
            chapters.append(chapter)
        return chapters
    
    def _generate_chapter_content(self, novel_id: str, chapter_id: str, chapter_num: int) -> str:
        """生成章节内容"""
        content = f"""
这是第{chapter_num}章的内容。

在这个章节中，故事继续发展。主角面临着新的挑战和机遇，他必须做出重要的决定。

周围的景色快速后退，风声在耳边呼啸。他深吸一口气，眼神变得坚定起来。

"无论如何，我都要走下去。"他在心中默念。

前方的道路依然充满未知，但他已经不再畏惧。过去的经历让他成长，让他变得更加坚强。

（本章完）
        """.strip()
        return content
    
    async def search(
        self,
        query: str,
        page: int = 1,
        page_size: int = 20,
        source: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "relevance"
    ) -> CrawlerResult:
        """搜索小说
        
        Args:
            query: 搜索关键词
            page: 页码
            page_size: 每页数量
            source: 指定来源平台
            category: 分类筛选
            sort_by: 排序方式 (relevance/rating/views/word_count/update)
            
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
            
            filtered = self._filter_novels(self.MOCK_NOVELS, query, source, category)
            sorted_novels = self._sort_novels(filtered, sort_by)
            
            total = len(sorted_novels)
            start = (page - 1) * page_size
            end = start + page_size
            paginated = sorted_novels[start:end]
            
            result_data = {
                "novels": paginated,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
            
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_detail(self, novel_id: str) -> CrawlerResult:
        """获取小说详情
        
        Args:
            novel_id: 小说 ID
            
        Returns:
            CrawlerResult: 小说详情
        """
        try:
            cache_key = self._generate_cache_key("detail", novel_id=novel_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            for novel in self.MOCK_NOVELS:
                if novel["id"] == novel_id:
                    detail = novel.copy()
                    detail["similar_novels"] = [
                        n["id"] for n in self.MOCK_NOVELS[:3] if n["id"] != novel_id
                    ]
                    detail["reviews_count"] = random.randint(1000, 50000)
                    detail["favorites"] = random.randint(10000, 500000)
                    
                    await self._set_cache(cache_key, detail)
                    
                    return self._create_result(success=True, data=detail)
            
            return self._create_result(success=False, error="小说不存在")
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_url(self, novel_id: str) -> CrawlerResult:
        """获取小说链接
        
        Args:
            novel_id: 小说 ID
            
        Returns:
            CrawlerResult: 小说链接
        """
        try:
            cache_key = self._generate_cache_key("url", novel_id=novel_id)
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.2))
            
            novel = None
            for n in self.MOCK_NOVELS:
                if n["id"] == novel_id:
                    novel = n
                    break
            
            if not novel:
                return self._create_result(success=False, error="小说不存在")
            
            url_data = {
                "novel_id": novel_id,
                "url": f"https://novel.example.com/book/{novel_id}",
                "source": novel["source"],
                "source_url": f"https://{novel['source']}.com/book/{novel_id}"
            }
            
            await self._set_cache(cache_key, url_data)
            
            return self._create_result(success=True, data=url_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_chapters(
        self,
        novel_id: str,
        page: int = 1,
        page_size: int = 100
    ) -> CrawlerResult:
        """获取章节列表
        
        Args:
            novel_id: 小说 ID
            page: 页码
            page_size: 每页数量
            
        Returns:
            CrawlerResult: 章节列表
        """
        try:
            cache_key = self._generate_cache_key(
                "chapters", novel_id=novel_id, page=page, page_size=page_size
            )
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # 验证小说存在
            novel = None
            for n in self.MOCK_NOVELS:
                if n["id"] == novel_id:
                    novel = n
                    break
            
            if not novel:
                return self._create_result(success=False, error="小说不存在")
            
            # 生成章节
            total_chapters = novel.get("chapter_count", 100)
            all_chapters = self._generate_chapters(novel_id, total_chapters)
            
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
                "novel_id": novel_id,
                "novel_title": novel["title"]
            }
            
            await self._set_cache(cache_key, result_data)
            
            return self._create_result(success=True, data=result_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def get_chapter_content(
        self,
        novel_id: str,
        chapter_id: str
    ) -> CrawlerResult:
        """获取章节内容
        
        Args:
            novel_id: 小说 ID
            chapter_id: 章节 ID
            
        Returns:
            CrawlerResult: 章节内容
        """
        try:
            cache_key = self._generate_cache_key(
                "content", novel_id=novel_id, chapter_id=chapter_id
            )
            cached = await self._get_cache(cache_key)
            if cached:
                return self._create_result(success=True, data=cached)
            
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # 验证小说存在
            novel = None
            for n in self.MOCK_NOVELS:
                if n["id"] == novel_id:
                    novel = n
                    break
            
            if not novel:
                return self._create_result(success=False, error="小说不存在")
            
            # 解析章节号
            try:
                chapter_num = int(chapter_id.split("_ch")[-1])
            except (ValueError, IndexError):
                chapter_num = 1
            
            # 生成内容
            content = self._generate_chapter_content(novel_id, chapter_id, chapter_num)
            
            # 获取前后章节
            prev_chapter = f"{novel_id}_ch{chapter_num - 1:04d}" if chapter_num > 1 else None
            next_chapter = f"{novel_id}_ch{chapter_num + 1:04d}" if chapter_num < novel.get("chapter_count", 100) else None
            
            chapter_data = {
                "chapter_id": chapter_id,
                "novel_id": novel_id,
                "title": f"第{chapter_num}章 {self.CHAPTER_TEMPLATES[(chapter_num-1) % len(self.CHAPTER_TEMPLATES)]}",
                "content": content,
                "number": chapter_num,
                "word_count": len(content),
                "prev_chapter_id": prev_chapter,
                "next_chapter_id": next_chapter,
                "is_vip": chapter_num > 50
            }
            
            await self._set_cache(cache_key, chapter_data)
            
            return self._create_result(success=True, data=chapter_data)
            
        except Exception as e:
            return self._create_result(success=False, error=str(e))
    
    async def close(self):
        if self._redis:
            await self._redis.close()
            self._redis = None
        
        await super().close()
