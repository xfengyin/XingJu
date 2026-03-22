/** 视频模块主入口 - XingJu v2.0 */
import React, { useState, useEffect } from 'react'
import VideoHeader from './VideoHeader'
import VideoSourceSelector from './VideoSourceSelector'
import VideoCategoryTabs from './VideoCategoryTabs'
import VideoRecommendGrid from './VideoRecommendGrid'
import VideoResultList from './VideoResultList'
import { useVideoApi } from '../../hooks/useVideoApi'
import type { Video } from '../../types/video'

interface VideoModuleProps {
  /** 搜索关键词 */
  query: string
}

/** 视频聚合模块 */
export default function VideoModule({ query }: VideoModuleProps) {
  const { search, isLoading } = useVideoApi()
  const [videos, setVideos] = useState<Video[]>([])

  // 搜索视频
  useEffect(() => {
    if (query.trim()) {
      search(query, 'all').then(setVideos).catch(console.error)
    }
  }, [query, search])

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <VideoHeader />

      {/* 源选择器和分类标签 */}
      <div className="space-y-4">
        <VideoSourceSelector />
        <VideoCategoryTabs />
      </div>

      {/* 精选视频网格 */}
      <VideoRecommendGrid videos={videos} />

      {/* 搜索结果列表 */}
      <VideoResultList
        videos={videos}
        isLoading={isLoading}
        query={query}
      />
    </div>
  )
}