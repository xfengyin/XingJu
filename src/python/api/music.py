"""音乐 API 路由"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

from models.schemas import Video, VideoSearchResult
from crawlers.music_crawler import MusicCrawler

router = APIRouter()


@router.get("/search")
async def search_music(
    query: str = Query(..., min_length=1, description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    source: Optional[str] = Query(None, description="指定来源平台"),
    sort_by: str = Query("relevance", description="排序方式 (relevance/rating/views/duration)")
):
    """
    搜索音乐
    
    - **query**: 搜索关键词（必填，至少 1 个字符）
    - **page**: 页码（从 1 开始，默认 1）
    - **page_size**: 每页数量（1-100，默认 20）
    - **source**: 可选，指定音乐来源平台（netease/qq/kugou/migu）
    - **sort_by**: 排序方式（relevance/rating/views/duration）
    
    返回音乐搜索结果，包含歌曲列表和分页信息
    """
    crawler = MusicCrawler()
    try:
        result = await crawler.search(query, page, page_size, source, sort_by)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=500, detail=result.error or "搜索失败")
    finally:
        await crawler.close()


@router.get("/{song_id}")
async def get_song_detail(song_id: str):
    """
    获取歌曲详情
    
    - **song_id**: 歌曲 ID
    
    返回歌曲的详细信息，包括标题、歌手、专辑、封面等
    """
    crawler = MusicCrawler()
    try:
        result = await crawler.get_detail(song_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "歌曲不存在")
    finally:
        await crawler.close()


@router.get("/{song_id}/url")
async def get_song_url(
    song_id: str,
    quality: str = Query("standard", description="音质 (standard/high/lossless)")
):
    """
    获取歌曲播放链接
    
    - **song_id**: 歌曲 ID
    - **quality**: 音质选择（standard/high/lossless）
    
    返回歌曲的实际播放链接，包含有效期
    """
    crawler = MusicCrawler()
    try:
        result = await crawler.get_url(song_id, quality)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "无法获取播放链接")
    finally:
        await crawler.close()


@router.get("/{song_id}/lyric")
async def get_song_lyric(song_id: str):
    """
    获取歌词
    
    - **song_id**: 歌曲 ID
    
    返回歌曲的歌词内容，支持 LRC 格式
    """
    crawler = MusicCrawler()
    try:
        result = await crawler.get_lyric(song_id)
        if result.success and result.data:
            return result.data
        else:
            raise HTTPException(status_code=404, detail=result.error or "歌词不存在")
    finally:
        await crawler.close()
