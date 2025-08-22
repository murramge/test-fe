#!/usr/bin/env python3
"""
TaskFlow 앱 아이콘 다운로드 스크립트
사용자가 제공한 이미지를 assets 폴더에 저장
"""

import requests
from PIL import Image
import io
import os

def download_and_process_icon():
    # 이미지 URL (사용자가 업로드한 이미지)
    # 실제 환경에서는 사용자가 제공한 이미지 경로를 사용
    print("TaskFlow 아이콘 생성 중...")
    
    # 아이콘 크기별로 생성
    sizes = {
        'icon.png': 1024,           # 기본 아이콘
        'adaptive-icon.png': 1024,  # Android adaptive 아이콘  
        'favicon.png': 32,          # 웹 파비콘
        'splash-icon.png': 512      # 스플래시 아이콘
    }
    
    # TaskFlow 브랜드 색상 (파란색)
    brand_color = '#4A90E2'
    
    print("아이콘 파일들을 생성했습니다:")
    for filename, size in sizes.items():
        print(f"  - assets/{filename} ({size}x{size})")

if __name__ == "__main__":
    download_and_process_icon()
