"""视频 API 路由"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

from crawlers.video_crawler import VideoCrawler

router = APIRouter()


@router.get("/search")
async def search_videos(
    query: str = Query(..., min_length=1, description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    source: Optional[str] = Query(None, description="指定来源平台"),
    category: Optional[str] = Query(None, description="分类筛选"),
    sort_by: str = Query("relevance", description="排序方式 (relevance/rating/views/duration/date)")
):
    """
    搜索视频
    
    - **query**: 搜索关键词（必填，至少 1 个字符）
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-100，默认 20）
    - **source**: 可选，指定视频来源平台（bilibili/tencent/iqiyi/youku）
    - **category**: 可选，分类筛选
    - **sort_by**: 排序方式（relevance/rating/views/duration/date）
    
    返回视频搜索结果，包含视频列表和分页信息
    """
    crawler = VideoCrawler()
    try:
        result = await crawler.search(query, page, page_size, source, category, sort_by)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=500, detail=result.error or "搜索失败")
    finally:
        await crawler.close()


@router.get("/{video_id}")
async def get_video_detail(video_id: str):
    """
    获取视频详情
    
    - **video_id**: 视频 ID
    
    返回视频的详细信息，包括标题、描述、封面、作者等
    """
    crawler = VideoCrawler()
    try:
        result = await crawler.get_detail(video_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "视频不存在")
    finally:
        await crawler.close()


@router.get("/{video_id}/url")
async def get_video_url(
    video_id: str,
    quality: str = Query("1080p", description="画质 (360p/480p/720p/1080p/4k)")
):
    """
    获取视频播放链接
    
    - **video_id**: 视频 ID
    - **quality**: 画质选择（360p/480p/720p/1080p/4k）
    
    返回视频的实际播放链接，可能包含有效期
    """
    crawler = VideoCrawler()
    try:
        result = await crawler.get_url(video_id, quality)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "无法获取播放链接")
    finally:
        await crawler.close()


@router.get("/{video_id}/danmaku")
async def get_video_danmaku(
    video_id: str,
    timestamp: int = Query(0, ge=0, description="时间戳（秒）")
):
    """
    获取视频弹幕
    
    - **video_id**: 视频 ID
    - **timestamp**: 可选，指定时间点的弹幕
    
    返回视频的弹幕列表
    """
    crawler = VideoCrawler()
    try:
        result = await crawler.get_danmaku(video_id, timestamp)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "弹幕不存在")
    finally:
        await crawler.close()
