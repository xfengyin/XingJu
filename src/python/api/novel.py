"""小说 API 路由"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

from crawlers.novel_crawler import NovelCrawler

router = APIRouter()


@router.get("/search")
async def search_novels(
    query: str = Query(..., min_length=1, description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    source: Optional[str] = Query(None, description="指定来源平台"),
    category: Optional[str] = Query(None, description="小说分类"),
    sort_by: str = Query("relevance", description="排序方式 (relevance/rating/views/word_count/update)")
):
    """
    搜索小说
    
    - **query**: 搜索关键词（必填，至少 1 个字符）
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-100，默认 20）
    - **source**: 可选，指定小说来源平台（qidian/jjwxc/zongheng/17k）
    - **category**: 可选，小说分类筛选（玄幻/仙侠/都市/科幻等）
    - **sort_by**: 排序方式（relevance/rating/views/word_count/update）
    
    返回小说搜索结果，包含小说列表和分页信息
    """
    crawler = NovelCrawler()
    try:
        result = await crawler.search(query, page, page_size, source, category, sort_by)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=500, detail=result.error or "搜索失败")
    finally:
        await crawler.close()


@router.get("/{novel_id}")
async def get_novel_detail(novel_id: str):
    """
    获取小说详情
    
    - **novel_id**: 小说 ID
    
    返回小说的详细信息，包括标题、作者、描述、封面、状态等
    """
    crawler = NovelCrawler()
    try:
        result = await crawler.get_detail(novel_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "小说不存在")
    finally:
        await crawler.close()


@router.get("/{novel_id}/url")
async def get_novel_url(novel_id: str):
    """
    获取小说链接
    
    - **novel_id**: 小说 ID
    
    返回小说的访问链接
    """
    crawler = NovelCrawler()
    try:
        result = await crawler.get_url(novel_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "无法获取链接")
    finally:
        await crawler.close()


@router.get("/{novel_id}/chapters")
async def get_novel_chapters(
    novel_id: str,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(100, ge=1, le=500, description="每页数量")
):
    """
    获取小说章节列表
    
    - **novel_id**: 小说 ID
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-500，默认 100）
    
    返回小说的章节列表，支持分页
    """
    crawler = NovelCrawler()
    try:
        result = await crawler.get_chapters(novel_id, page, page_size)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "章节列表不存在")
    finally:
        await crawler.close()


@router.get("/{novel_id}/chapters/{chapter_id}")
async def get_chapter_content(
    novel_id: str,
    chapter_id: str
):
    """
    获取章节内容
    
    - **novel_id**: 小说 ID
    - **chapter_id**: 章节 ID
    
    返回章节的完整内容
    """
    crawler = NovelCrawler()
    try:
        result = await crawler.get_chapter_content(novel_id, chapter_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "章节内容不存在")
    finally:
        await crawler.close()
