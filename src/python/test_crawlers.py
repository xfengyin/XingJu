#!/usr/bin/env python3
"""爬虫功能测试脚本"""
import asyncio
import json
import sys
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

from crawlers.music_crawler import MusicCrawler
from crawlers.video_crawler import VideoCrawler
from crawlers.novel_crawler import NovelCrawler
from crawlers.manga_crawler import MangaCrawler


async def test_music_crawler():
    """测试音乐爬虫"""
    print("\n" + "="*60)
    print("🎵 测试音乐爬虫")
    print("="*60)
    
    crawler = MusicCrawler()
    
    # 测试搜索
    print("\n1. 搜索 '周杰伦'")
    result = await crawler.search("周杰伦", page=1, page_size=5)
    if result.success:
        print(f"✓ 搜索成功，找到 {result.data['total']} 首歌曲")
        for song in result.data['songs'][:3]:
            print(f"  - {song['title']} - {song['artist']} ({song['source']})")
    else:
        print(f"✗ 搜索失败：{result.error}")
    
    # 测试获取详情
    print("\n2. 获取歌曲详情 (song_001)")
    result = await crawler.get_detail("song_001")
    if result.success:
        print(f"✓ 获取成功：{result.data['title']}")
        print(f"  专辑：{result.data.get('album', 'N/A')}")
        print(f"  时长：{result.data.get('duration', 0)}秒")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取播放链接
    print("\n3. 获取播放链接 (quality=high)")
    result = await crawler.get_url("song_001", quality="high")
    if result.success:
        print(f"✓ 获取成功")
        print(f"  URL: {result.data['url']}")
        print(f"  音质：{result.data['quality']}, 码率：{result.data['bitrate']}kbps")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取歌词
    print("\n4. 获取歌词")
    result = await crawler.get_lyric("song_001")
    if result.success:
        print(f"✓ 获取成功")
        lines = result.data['lyric'].split('\n')[:5]
        for line in lines:
            print(f"  {line}")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    await crawler.close()
    print("\n✓ 音乐爬虫测试完成")


async def test_video_crawler():
    """测试视频爬虫"""
    print("\n" + "="*60)
    print("📺 测试视频爬虫")
    print("="*60)
    
    crawler = VideoCrawler()
    
    # 测试搜索
    print("\n1. 搜索 'Python'")
    result = await crawler.search("Python", page=1, page_size=5)
    if result.success:
        print(f"✓ 搜索成功，找到 {result.data['total']} 个视频")
        for video in result.data['videos'][:3]:
            print(f"  - {video['title']} ({video['source']})")
            print(f"    播放：{video.get('views', 0):,} | 评分：{video.get('rating', 0)}")
    else:
        print(f"✗ 搜索失败：{result.error}")
    
    # 测试获取详情
    print("\n2. 获取视频详情 (video_002)")
    result = await crawler.get_detail("video_002")
    if result.success:
        print(f"✓ 获取成功：{result.data['title']}")
        print(f"  作者：{result.data.get('author', 'N/A')}")
        print(f"  时长：{result.data.get('duration', 0)}秒")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取播放链接
    print("\n3. 获取播放链接 (quality=1080p)")
    result = await crawler.get_url("video_002", quality="1080p")
    if result.success:
        print(f"✓ 获取成功")
        print(f"  URL: {result.data['url']}")
        print(f"  画质：{result.data['quality']} ({result.data['width']}x{result.data['height']})")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取弹幕
    print("\n4. 获取弹幕")
    result = await crawler.get_danmaku("video_001")
    if result.success:
        print(f"✓ 获取成功，共 {result.data['total']} 条弹幕")
        for dm in result.data['danmakus'][:3]:
            print(f"  [{dm['timestamp']}s] {dm['content']}")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    await crawler.close()
    print("\n✓ 视频爬虫测试完成")


async def test_novel_crawler():
    """测试小说爬虫"""
    print("\n" + "="*60)
    print("📚 测试小说爬虫")
    print("="*60)
    
    crawler = NovelCrawler()
    
    # 测试搜索
    print("\n1. 搜索 '玄幻'")
    result = await crawler.search("玄幻", page=1, page_size=5, category="玄幻")
    if result.success:
        print(f"✓ 搜索成功，找到 {result.data['total']} 部小说")
        for novel in result.data['novels'][:3]:
            print(f"  - 《{novel['title']}》by {novel['author']}")
            print(f"    {novel.get('word_count', 0):,}字 | {novel.get('rating', 0)}分 | {novel['status']}")
    else:
        print(f"✗ 搜索失败：{result.error}")
    
    # 测试获取详情
    print("\n2. 获取小说详情 (novel_001)")
    result = await crawler.get_detail("novel_001")
    if result.success:
        print(f"✓ 获取成功：《{result.data['title']}》")
        print(f"  作者：{result.data['author']}")
        print(f"  章节数：{result.data.get('chapter_count', 0)}")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取章节列表
    print("\n3. 获取章节列表 (前 5 章)")
    result = await crawler.get_chapters("novel_001", page=1, page_size=5)
    if result.success:
        print(f"✓ 获取成功，共 {result.data['total']} 章")
        for ch in result.data['chapters'][:5]:
            vip_mark = " [VIP]" if ch.get('is_vip') else ""
            print(f"  - {ch['title']}{vip_mark} ({ch.get('word_count', 0)}字)")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取章节内容
    print("\n4. 获取章节内容 (novel_001_ch0001)")
    result = await crawler.get_chapter_content("novel_001", "novel_001_ch0001")
    if result.success:
        print(f"✓ 获取成功：{result.data['title']}")
        content = result.data['content'][:200]
        print(f"  内容预览：{content}...")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    await crawler.close()
    print("\n✓ 小说爬虫测试完成")


async def test_manga_crawler():
    """测试漫画爬虫"""
    print("\n" + "="*60)
    print("🎨 测试漫画爬虫")
    print("="*60)
    
    crawler = MangaCrawler()
    
    # 测试搜索
    print("\n1. 搜索 '热血'")
    result = await crawler.search("热血", page=1, page_size=5, category="热血")
    if result.success:
        print(f"✓ 搜索成功，找到 {result.data['total']} 部漫画")
        for manga in result.data['mangas'][:3]:
            print(f"  - 《{manga['title']}》by {manga['author']}")
            print(f"    {manga.get('chapter_count', 0)}话 | {manga.get('rating', 0)}分 | {manga['status']}")
    else:
        print(f"✗ 搜索失败：{result.error}")
    
    # 测试获取详情
    print("\n2. 获取漫画详情 (manga_001)")
    result = await crawler.get_detail("manga_001")
    if result.success:
        print(f"✓ 获取成功：《{result.data['title']}》")
        print(f"  作者：{result.data['author']}")
        print(f"  话数：{result.data.get('chapter_count', 0)}")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取章节列表
    print("\n3. 获取章节列表 (前 5 话)")
    result = await crawler.get_chapters("manga_001", page=1, page_size=5)
    if result.success:
        print(f"✓ 获取成功，共 {result.data['total']} 话")
        for ch in result.data['chapters'][:5]:
            print(f"  - {ch['title']} ({ch.get('page_count', 0)}页)")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    # 测试获取章节图片
    print("\n4. 获取章节图片 (manga_001_ch0001)")
    result = await crawler.get_chapter_images("manga_001", "manga_001_ch0001")
    if result.success:
        print(f"✓ 获取成功：{result.data['title']}")
        print(f"  总页数：{result.data['total_pages']}")
        print(f"  图片格式：{result.data['format']}, 质量：{result.data['quality']}")
        if result.data['pages']:
            first_page = result.data['pages'][0]
            print(f"  第 1 页：{first_page['image_url']} ({first_page['width']}x{first_page['height']})")
    else:
        print(f"✗ 获取失败：{result.error}")
    
    await crawler.close()
    print("\n✓ 漫画爬虫测试完成")


async def main():
    """运行所有测试"""
    print("\n" + "█"*60)
    print("█  XingJu 爬虫功能测试")
    print("█"*60)
    
    try:
        await test_music_crawler()
        await test_video_crawler()
        await test_novel_crawler()
        await test_manga_crawler()
        
        print("\n" + "█"*60)
        print("█  ✓ 所有测试完成!")
        print("█"*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ 测试过程中发生错误：{e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
