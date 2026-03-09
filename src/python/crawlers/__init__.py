"""爬虫模块"""
from crawlers.base import BaseCrawler, CrawlerResult
from crawlers.music_crawler import MusicCrawler
from crawlers.video_crawler import VideoCrawler
from crawlers.novel_crawler import NovelCrawler
from crawlers.manga_crawler import MangaCrawler

__all__ = [
    "BaseCrawler",
    "CrawlerResult",
    "MusicCrawler",
    "VideoCrawler",
    "NovelCrawler",
    "MangaCrawler"
]
