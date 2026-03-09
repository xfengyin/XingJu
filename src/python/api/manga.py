"""漫画 API 路由"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

from crawlers.manga_crawler import MangaCrawler

router = APIRouter()


@router.get("/search")
async def search_mangas(
    query: str = Query(..., min_length=1, description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    source: Optional[str] = Query(None, description="指定来源平台"),
    category: Optional[str] = Query(None, description="漫画分类"),
    sort_by: str = Query("relevance", description="排序方式 (relevance/rating/views/update/chapters)")
):
    """
    搜索漫画
    
    - **query**: 搜索关键词（必填，至少 1 个字符）
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-100，默认 20）
    - **source**: 可选，指定漫画来源平台（bilibili/tencent/kuaikan/youku）
    - **category**: 可选，漫画分类筛选（热血/搞笑/恋爱/玄幻等）
    - **sort_by**: 排序方式（relevance/rating/views/update/chapters）
    
    返回漫画搜索结果，包含漫画列表和分页信息
    """
    crawler = MangaCrawler()
    try:
        result = await crawler.search(query, page, page_size, source, category, sort_by)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=500, detail=result.error or "搜索失败")
    finally:
        await crawler.close()


@router.get("/{manga_id}")
async def get_manga_detail(manga_id: str):
    """
    获取漫画详情
    
    - **manga_id**: 漫画 ID
    
    返回漫画的详细信息，包括标题、作者、描述、封面、状态等
    """
    crawler = MangaCrawler()
    try:
        result = await crawler.get_detail(manga_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "漫画不存在")
    finally:
        await crawler.close()


@router.get("/{manga_id}/url")
async def get_manga_url(manga_id: str):
    """
    获取漫画链接
    
    - **manga_id**: 漫画 ID
    
    返回漫画的访问链接
    """
    crawler = MangaCrawler()
    try:
        result = await crawler.get_url(manga_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "无法获取链接")
    finally:
        await crawler.close()


@router.get("/{manga_id}/chapters")
async def get_manga_chapters(
    manga_id: str,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(100, ge=1, le=500, description="每页数量")
):
    """
    获取漫画章节列表
    
    - **manga_id**: 漫画 ID
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-500，默认 100）
    
    返回漫画的章节列表，支持分页
    """
    crawler = MangaCrawler()
    try:
        result = await crawler.get_chapters(manga_id, page, page_size)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "章节列表不存在")
    finally:
        await crawler.close()


@router.get("/{manga_id}/chapters/{chapter_id}")
async def get_chapter_images(
    manga_id: str,
    chapter_id: str
):
    """
    获取章节图片
    
    - **manga_id**: 漫画 ID
    - **chapter_id**: 章节 ID
    
    返回章节的所有图片列表
    """
    crawler = MangaCrawler()
    try:
        result = await crawler.get_chapter_images(manga_id, chapter_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "章节图片不存在")
    finally:
        await crawler.close()
