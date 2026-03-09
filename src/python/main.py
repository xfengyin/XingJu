"""
XingJu Python Backend
多元内容聚合后端服务
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import music, video, novel, manga
import uvicorn

app = FastAPI(
    title="XingJu API",
    description="多元内容聚合 API",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(music.router, prefix="/api/music", tags=["音乐"])
app.include_router(video.router, prefix="/api/video", tags=["视频"])
app.include_router(novel.router, prefix="/api/novel", tags=["小说"])
app.include_router(manga.router, prefix="/api/manga", tags=["漫画"])


@app.get("/")
async def root():
    return {"message": "XingJu API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)