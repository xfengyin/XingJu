/** 音乐模块主入口 - XingJu v2.0 */
import React, { useState, useEffect } from 'react'
import MusicHeader from './MusicHeader'
import MusicSourceSelector from './MusicSourceSelector'
import MusicRecommendList from './MusicRecommendList'
import MusicTrackList from './MusicTrackList'
import { useMusicApi } from '../../hooks/useMusicApi'
import type { MusicTrack } from '../../types/music'

interface MusicModuleProps {
  /** 搜索关键词 */
  query: string
}

/** 音乐聚合模块 */
export default function MusicModule({ query }: MusicModuleProps) {
  const { search, isLoading } = useMusicApi()
  const [tracks, setTracks] = useState<MusicTrack[]>([])

  // 搜索音乐
  useEffect(() => {
    if (query.trim()) {
      search(query, 'all').then(setTracks).catch(console.error)
    }
  }, [query, search])

  return (
    <div className="space-y-8">
      {/* 标题和源选择器 */}
      <div className="flex items-end justify-between">
        <MusicHeader />
        <MusicSourceSelector />
      </div>

      {/* 推荐歌单 */}
      <MusicRecommendList />

      {/* 搜索结果 */}
      <MusicTrackList
        tracks={tracks}
        isLoading={isLoading}
        query={query}
      />
    </div>
  )
}