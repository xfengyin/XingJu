"""数据模型定义"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ==================== 视频模型 ====================

class Video(BaseModel):
    """视频信息"""
    id: str
    title: str
    description: Optional[str] = None
    cover: Optional[str] = None
    url: Optional[str] = None
    duration: Optional[int] = Field(None, description="时长（秒）")
    source: str = Field(..., description="来源平台")
    author: Optional[str] = None
    publish_date: Optional[datetime] = None
    views: Optional[int] = None
    rating: Optional[float] = None
    tags: List[str] = Field(default_factory=list)
    extra: Dict[str, Any] = Field(default_factory=dict)


class VideoSearchResult(BaseModel):
    """视频搜索结果"""
    videos: List[Video]
    total: int
    page: int
    page_size: int


class VideoPlayUrl(BaseModel):
    """视频播放链接"""
    video_id: str
    url: str
    quality: Optional[str] = None
    format: Optional[str] = None
    expires: Optional[datetime] = None


# ==================== 小说模型 ====================

class NovelChapter(BaseModel):
    """小说章节"""
    id: str
    title: str
    number: int = Field(..., description="章节序号")
    word_count: Optional[int] = None
    publish_date: Optional[datetime] = None
    is_vip: bool = Field(False, description="是否 VIP 章节")


class Novel(BaseModel):
    """小说信息"""
    id: str
    title: str
    author: str
    description: Optional[str] = None
    cover: Optional[str] = None
    source: str = Field(..., description="来源平台")
    category: Optional[str] = None
    status: Optional[str] = Field(None, description="连载状态")
    word_count: Optional[int] = None
    chapter_count: Optional[int] = None
    rating: Optional[float] = None
    views: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    last_update: Optional[datetime] = None
    extra: Dict[str, Any] = Field(default_factory=dict)


class NovelSearchResult(BaseModel):
    """小说搜索结果"""
    novels: List[Novel]
    total: int
    page: int
    page_size: int


class ChapterContent(BaseModel):
    """章节内容"""
    chapter_id: str
    novel_id: str
    title: str
    content: str
    number: int
    prev_chapter_id: Optional[str] = None
    next_chapter_id: Optional[str] = None


# ==================== 漫画模型 ====================

class MangaChapter(BaseModel):
    """漫画章节"""
    id: str
    title: str
    number: int = Field(..., description="章节序号")
    page_count: Optional[int] = None
    publish_date: Optional[datetime] = None


class MangaPage(BaseModel):
    """漫画页面"""
    page_number: int
    image_url: str
    width: Optional[int] = None
    height: Optional[int] = None


class Manga(BaseModel):
    """漫画信息"""
    id: str
    title: str
    author: str
    description: Optional[str] = None
    cover: Optional[str] = None
    source: str = Field(..., description="来源平台")
    category: Optional[str] = None
    status: Optional[str] = Field(None, description="连载状态")
    chapter_count: Optional[int] = None
    rating: Optional[float] = None
    views: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    last_update: Optional[datetime] = None
    extra: Dict[str, Any] = Field(default_factory=dict)


class MangaSearchResult(BaseModel):
    """漫画搜索结果"""
    mangas: List[Manga]
    total: int
    page: int
    page_size: int


class ChapterImages(BaseModel):
    """章节图片列表"""
    chapter_id: str
    manga_id: str
    title: str
    pages: List[MangaPage]
    total_pages: int
