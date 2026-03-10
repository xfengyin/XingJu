import React, { useState } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  source: string
}

export default function MusicModule({ query }: { query: string }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 模拟数据
  const mockTracks: Track[] = [
    {
      id: '1',
      title: '赛博朋克 2077',
      artist: '未来乐队',
      album: '霓虹之夜',
      duration: '04:30',
      cover: '🎵',
      source: 'netease',
    },
    {
      id: '2',
      title: '电子梦境',
      artist: 'AI 音乐家',
      album: '虚拟世界',
      duration: '03:45',
      cover: '🎵',
      source: 'qq',
    },
  ]

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold neon-text mb-4">🎵 音乐聚合</h2>
        <div className="flex gap-4 mb-4">
          <button className="cyber-button px-6 py-2">网易云</button>
          <button className="cyber-button px-6 py-2">QQ 音乐</button>
          <button className="cyber-button px-6 py-2">酷狗</button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-4">搜索结果</h3>
        {isLoading ? (
          <div className="text-center py-20 text-cyber-gray-400">
            加载中...
          </div>
        ) : (
          <div className="space-y-2">
            {mockTracks.map((track) => (
              <div
                key={track.id}
                className="cyber-card flex items-center gap-4 p-4 cursor-pointer hover:bg-cyber-panel/50"
              >
                <div className="text-4xl">{track.cover}</div>
                <div className="flex-1">
                  <div className="font-bold text-white">{track.title}</div>
                  <div className="text-sm text-cyber-gray-400">
                    {track.artist} - {track.album}
                  </div>
                </div>
                <div className="text-cyber-gray-400">{track.duration}</div>
                <div className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded text-sm">
                  {track.source}
                </div>
                <button className="p-3 hover:bg-cyber-panel rounded-full transition-all">
                  ▶
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
