import { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

// 高性能图片懒加载组件 (Linear 风格)
export function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px', threshold: 0.01 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`relative overflow-hidden bg-[#f5f6f7] ${className}`} ref={imgRef}>
      {/* 占位符/骨架屏 */}
      {!isLoaded && (
        <div className="absolute inset-0 skeleton-shimmer flex items-center justify-center">
          {placeholder ? (
            <span className="text-[#b0b4ba] text-xs">{placeholder}</span>
          ) : (
            <div className="w-5 h-5 border-2 border-[#e5e5e5] border-t-[#5e6ad2] rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}

export default LazyImage
