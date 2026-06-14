import requests
from bs4 import BeautifulSoup
import re
import json
import time
import os

PYTHON = '/c/Users/57623/AppData/Roaming/kimi-desktop/daimon-bundle/runtime/python/cpython-3.12/python.exe'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def get_html(url):
    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_links_from_summary(html):
    soup = BeautifulSoup(html, 'html.parser')
    links = []
    # Find all links that contain year info
    for a in soup.find_all('a', href=True):
        text = a.get_text(strip=True)
        href = a['href']
        # Look for patterns like 2010, 2011, etc. and 英语一/英语二
        m = re.search(r'(201[0-4]).*英语[一二]', text)
        if m:
            year = m.group(1)
            paper_type = '1' if '英语一' in text else '2'
            if href.startswith('http'):
                full_url = href
            else:
                full_url = 'https://kaoyan.eol.cn' + href
            links.append({
                'year': year,
                'type': paper_type,
                'url': full_url,
                'text': text
            })
    return links

# Test first page
url1 = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211048.shtml'
html1 = get_html(url1)
if html1:
    soup = BeautifulSoup(html1, 'html.parser')
    # Print all links
    for a in soup.find_all('a', href=True):
        text = a.get_text(strip=True)
        if '英语' in text and '201' in text:
            print(f"TEXT: {text}")
            print(f"HREF: {a['href']}")
            print('---')
