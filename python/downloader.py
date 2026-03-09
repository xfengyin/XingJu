#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多线程下载器 - 支持断点续传
"""

import sys
import json
import os
import threading
import requests
from typing import Optional, Dict, Any
from pathlib import Path
from urllib.parse import urlparse


class DownloadTask:
    """下载任务"""
    
    def __init__(self, task_id: str, url: str, output_path: str, threads: int = 4):
        self.task_id = task_id
        self.url = url
        self.output_path = output_path
        self.threads = threads
        self.file_size = 0
        self.downloaded = 0
        self.speed = 0
        self.progress = 0
        self.status = 'pending'
        self.error_message = ''
        self.chunks = []
        self.session = requests.Session()
        
    def get_file_info(self) -> bool:
        """获取文件信息"""
        try:
            head = self.session.head(self.url, timeout=10)
            if head.status_code == 200:
                self.file_size = int(head.headers.get('Content-Length', 0))
                return True
            elif head.status_code == 206:
                # 支持断点续传
                self.file_size = int(head.headers.get('Content-Length', 0))
                return True
            else:
                self.error_message = f'无法获取文件信息：{head.status_code}'
                return False
        except Exception as e:
            self.error_message = str(e)
            return False
    
    def calculate_chunks(self) -> None:
        """计算分片"""
        if self.file_size == 0:
            # 不支持分片下载
            self.chunks = [(0, -1)]
            return
        
        chunk_size = self.file_size // self.threads
        for i in range(self.threads):
            start = i * chunk_size
            end = (i + 1) * chunk_size - 1 if i < self.threads - 1 else self.file_size - 1
            self.chunks.append((start, end))
    
    def download_chunk(self, chunk_id: int, start: int, end: int, temp_file: Path) -> bool:
        """下载分片"""
        try:
            headers = {}
            if self.file_size > 0:
                headers['Range'] = f'bytes={start}-{end}'
            
            response = self.session.get(self.url, headers=headers, stream=True, timeout=30)
            
            if response.status_code not in [200, 206]:
                return False
            
            chunk_downloaded = 0
            with open(temp_file, 'r+b') as f:
                f.seek(start)
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        chunk_downloaded += len(chunk)
                        self.downloaded += len(chunk)
                        
                        # 更新进度
                        if self.file_size > 0:
                            self.progress = (self.downloaded / self.file_size) * 100
            
            return True
        except Exception as e:
            print(f"分片 {chunk_id} 下载失败：{e}", file=sys.stderr)
            return False
    
    def download(self, progress_callback=None) -> bool:
        """执行下载"""
        self.status = 'downloading'
        
        # 获取文件信息
        if not self.get_file_info():
            self.status = 'failed'
            return False
        
        # 计算分片
        self.calculate_chunks()
        
        # 创建临时文件
        temp_path = f"{self.output_path}.tmp"
        temp_file = Path(temp_path)
        
        # 检查是否支持断点续传
        resume = False
        if temp_file.exists():
            existing_size = temp_file.stat().st_size
            if existing_size < self.file_size:
                # 续传
                resume = True
                self.downloaded = existing_size
            else:
                # 已完成
                temp_file.rename(self.output_path)
                self.progress = 100
                self.status = 'completed'
                return True
        else:
            # 创建文件
            if self.file_size > 0:
                with open(temp_path, 'wb') as f:
                    f.seek(self.file_size - 1)
                    f.write(b'\0')
        
        # 多线程下载
        threads = []
        for chunk_id, (start, end) in enumerate(self.chunks):
            if resume and start < self.downloaded:
                start = self.downloaded
            
            t = threading.Thread(
                target=self.download_chunk,
                args=(chunk_id, start, end, temp_file)
            )
            threads.append(t)
            t.start()
        
        # 等待所有线程完成
        for t in threads:
            t.join()
        
        # 检查是否完成
        if self.downloaded >= self.file_size:
            # 重命名文件
            temp_file.rename(self.output_path)
            self.progress = 100
            self.status = 'completed'
            return True
        else:
            self.status = 'failed'
            self.error_message = '下载未完成'
            return False


def main():
    """主函数"""
    if len(sys.argv) < 4:
        print(json.dumps({
            'success': False,
            'error': '参数不足，需要：任务 ID URL 输出路径 [线程数]'
        }))
        sys.exit(1)
    
    task_id = sys.argv[1]
    url = sys.argv[2]
    output_path = sys.argv[3]
    threads = int(sys.argv[4]) if len(sys.argv) > 4 else 4
    
    task = DownloadTask(task_id, url, output_path, threads)
    
    def progress_callback():
        """进度回调"""
        print(json.dumps({
            'task_id': task_id,
            'progress': task.progress,
            'downloaded': task.downloaded,
            'size': task.file_size,
            'status': task.status,
            'speed': task.speed
        }))
        sys.stdout.flush()
    
    try:
        success = task.download(progress_callback)
        
        print(json.dumps({
            'success': success,
            'task_id': task_id,
            'progress': task.progress,
            'downloaded': task.downloaded,
            'size': task.file_size,
            'status': task.status,
            'error': task.error_message if not success else None
        }))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'task_id': task_id,
            'error': str(e)
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
