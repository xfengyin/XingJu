"""爬虫基类 - 定义爬虫接口"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import aiohttp
from pydantic import BaseModel


class CrawlerResult(BaseModel):
    """爬虫结果基类"""
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    source: str = ""


class BaseCrawler(ABC):
    """爬虫抽象基类
    
    所有具体爬虫必须继承此类并实现抽象方法
    """
    
    def __init__(self, session: Optional[aiohttp.ClientSession] = None):
        """初始化爬虫
        
        Args:
            session: aiohttp 会话，用于复用连接
        """
        self._session = session
        self._owned_session = False
    
    async def get_session(self) -> aiohttp.ClientSession:
        """获取或创建 aiohttp 会话"""
        if self._session is None:
            self._session = aiohttp.ClientSession()
            self._owned_session = True
        return self._session
    
    async def close(self):
        """关闭会话"""
        if self._owned_session and self._session:
            await self._session.close()
            self._session = None
            self._owned_session = False
    
    @abstractmethod
    async def search(self, query: str, page: int = 1, page_size: int = 20) -> CrawlerResult:
        """搜索内容
        
        Args:
            query: 搜索关键词
            page: 页码
            page_size: 每页数量
            
        Returns:
            CrawlerResult: 搜索结果
        """
        pass
    
    @abstractmethod
    async def get_detail(self, item_id: str) -> CrawlerResult:
        """获取详情
        
        Args:
            item_id: 内容 ID
            
        Returns:
            CrawlerResult: 详情数据
        """
        pass
    
    @abstractmethod
    async def get_url(self, item_id: str) -> CrawlerResult:
        """获取播放/访问链接
        
        Args:
            item_id: 内容 ID
            
        Returns:
            CrawlerResult: 链接数据
        """
        pass
    
    async def _request(
        self,
        method: str,
        url: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 30
    ) -> Optional[Dict[str, Any]]:
        """发送 HTTP 请求
        
        Args:
            method: HTTP 方法
            url: 请求 URL
            params: 查询参数
            data: 请求体数据
            headers: 请求头
            timeout: 超时时间（秒）
            
        Returns:
            响应 JSON 数据，失败返回 None
        """
        session = await self.get_session()
        try:
            async with session.request(
                method,
                url,
                params=params,
                json=data,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=timeout)
            ) as response:
                if response.status == 200:
                    return await response.json()
                return None
        except Exception as e:
            return None
    
    def _create_result(
        self,
        success: bool,
        data: Optional[Any] = None,
        error: Optional[str] = None
    ) -> CrawlerResult:
        """创建爬虫结果
        
        Args:
            success: 是否成功
            data: 返回数据
            error: 错误信息
            
        Returns:
            CrawlerResult
        """
        return CrawlerResult(
            success=success,
            data=data,
            error=error,
            source=self.__class__.__name__
        )
