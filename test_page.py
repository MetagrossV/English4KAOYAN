import requests
from bs4 import BeautifulSoup
import re
import json
import time
import os

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def get_html(url):
    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        r.encoding = 'utf-8'
        return r.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

# Try http instead of https
url = 'http://kaoyan.eol.cn/yingyu_3977/20141206/t20141206_1210405.shtml'
html = get_html(url)
if html:
    soup = BeautifulSoup(html, 'html.parser')
    for sel in ['.content', '#content', '.article', '#article', '.main', '#main', '.text', '#text']:
        elem = soup.select_one(sel)
        if elem:
            print(f"Found {sel}")
            text = elem.get_text(separator='\n', strip=True)
            print(text[:2000])
            print('---')
    body = soup.find('body')
    if body:
        text = body.get_text(separator='\n', strip=True)
        lines = text.split('\n')
        for line in lines[:200]:
            if 'Text' in line or '阅读' in line or 'Passage' in line:
                print(f"LINE: {line.strip()}")
