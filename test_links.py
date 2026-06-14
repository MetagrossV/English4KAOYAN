import requests
from bs4 import BeautifulSoup
import re

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

url = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211048.shtml'
html = get_html(url)
soup = BeautifulSoup(html, 'html.parser')

for a in soup.find_all('a', href=True):
    text = a.get_text(strip=True)
    if '英语' in text:
        href = a['href']
        # Resolve relative URLs properly
        if href.startswith('http'):
            full = href
        elif href.startswith('/'):
            full = 'https://kaoyan.eol.cn' + href
        elif href.startswith('./'):
            base = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/'
            full = base + href[2:]
        elif href.startswith('../'):
            base = 'https://kaoyan.eol.cn/fu_xi/yingyu/'
            full = base + href[3:]
        else:
            full = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/' + href
        print(f"TEXT: {text}")
        print(f"HREF: {full}")
        print('---')
