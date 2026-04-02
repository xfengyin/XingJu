import { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

// 高性能图片懒加载组件
export function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // 使用 IntersectionObserver 实现懒加载
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* 占位符/骨架屏 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1a1a2e] animate-pulse flex items-center justify-center">
          {placeholder ? (
            <span className="text-gray-600 text-xs">{placeholder}</span>
          ) : (
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
      
      {/* 实际图片 */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)} // 加载失败也移除占位符
        />
      )}
    </div>
  )
}

export default LazyImage
