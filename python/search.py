#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
内容搜索后端 - 支持多个内容平台
"""

import sys
import json
import requests
from typing import List, Dict, Any
from urllib.parse import quote


class ContentSearcher:
    """内容搜索器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def search_music(self, query: str) -> List[Dict[str, Any]]:
        """搜索音乐"""
        results = []
        
        # 这里可以集成多个音乐平台 API
        # 示例：网易云音乐搜索
        
        try:
            # 网易云音乐搜索 API (示例)
            url = f"https://music.163.com/api/search/get"
            params = {
                's': query,
                'type': 1,  # 1: 单曲
                'limit': 20,
                'offset': 0
            }
            
            response = self.session.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('code') == 200 and data.get('result'):
                    songs = data['result'].get('songs', [])
                    for song in songs:
                        results.append({
                            'id': str(song['id']),
                            'title': song['name'],
                            'artist': '/'.join([artist['name'] for artist in song.get('artists', [])]),
                            'album': song.get('album', {}).get('name', ''),
                            'cover': song.get('album', {}).get('picUrl', ''),
                            'duration': song.get('duration', 0) // 1000,
                            'source': 'netease',
                            'type': 'music'
                        })
        except Exception as e:
            print(f"网易云音乐搜索失败：{e}", file=sys.stderr)
        
        # 如果没有结果，返回空列表
        return results
    
    def search_video(self, query: str) -> List[Dict[str, Any]]:
        """搜索视频"""
        results = []
        
        # 这里可以集成多个视频平台 API
        # 示例：B 站搜索
        
        try:
            # B 站搜索 API (示例)
            url = f"https://api.bilibili.com/x/web-interface/search/type"
            params = {
                'search_type': 'video',
                'keyword': query,
                'page': 1,
                'page_size': 20
            }
            
            response = self.session.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('code') == 0 and data.get('data'):
                    videos = data['data'].get('result', [])
                    for video in videos:
                        results.append({
                            'id': str(video.get('aid', '')),
                            'title': video.get('title', '').replace('<em class="keyword">', '').replace('</em>', ''),
                            'artist': video.get('author', ''),
                            'cover': video.get('pic', ''),
                            'duration': video.get('duration', ''),
                            'views': video.get('play', 0),
                            'source': 'bilibili',
                            'type': 'video'
                        })
        except Exception as e:
            print(f"B 站搜索失败：{e}", file=sys.stderr)
        
        return results
    
    def search_novel(self, query: str) -> List[Dict[str, Any]]:
        """搜索小说"""
        results = []
        
        # 这里可以集成多个小说平台 API
        # 示例：起点中文网搜索
        
        try:
            # 起点搜索 (示例，实际需要分析网页)
            url = f"https://www.qidian.com/search/{quote(query)}"
            
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                # 这里需要解析 HTML，简化处理
                # 实际项目中应该使用 BeautifulSoup 或 lxml
                pass
        except Exception as e:
            print(f"起点搜索失败：{e}", file=sys.stderr)
        
        return results
    
    def search_manga(self, query: str) -> List[Dict[str, Any]]:
        """搜索漫画"""
        results = []
        
        # 这里可以集成多个漫画平台 API
        # 示例：B 站漫画搜索
        
        try:
            # B 站漫画搜索 API (示例)
            url = f"https://manga.bilibili.com/twirp/comic.v1.Comic/Search"
            data = {
                'page_num': 1,
                'page_size': 20,
                'key_word': query
            }
            
            response = self.session.post(url, json=data, timeout=10)
            if response.status_code == 200:
                resp_data = response.json()
                if resp_data.get('code') == 0 and resp_data.get('data'):
                    mangas = resp_data['data'].get('list', [])
                    for manga in mangas:
                        results.append({
                            'id': str(manga.get('id', '')),
                            'title': manga.get('title', ''),
                            'author': manga.get('author_name', ''),
                            'cover': manga.get('vertical_cover', ''),
                            'description': manga.get('evaluate', ''),
                            'status': manga.get('status', ''),
                            'source': 'bilibili',
                            'type': 'manga'
                        })
        except Exception as e:
            print(f"B 站漫画搜索失败：{e}", file=sys.stderr)
        
        return results


def main():
    """主函数"""
    if len(sys.argv) < 3:
        print(json.dumps({
            'error': '参数不足，需要：类型 关键词'
        }))
        sys.exit(1)
    
    search_type = sys.argv[1]
    query = sys.argv[2]
    
    searcher = ContentSearcher()
    results = []
    
    try:
        if search_type == 'music':
            results = searcher.search_music(query)
        elif search_type == 'video':
            results = searcher.search_video(query)
        elif search_type == 'novel':
            results = searcher.search_novel(query)
        elif search_type == 'manga':
            results = searcher.search_manga(query)
        else:
            print(json.dumps({
                'error': f'不支持的搜索类型：{search_type}'
            }))
            sys.exit(1)
        
        # 输出结果
        print(json.dumps(results, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e)
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
