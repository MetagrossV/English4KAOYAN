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

urls_to_test = [
    'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211034.shtml',  # 2014-1
    'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211020.shtml',  # 2014-2
    'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211049.shtml',  # 2010-2014 English 2 summary
    'https://kaoyan.eol.cn/shiti/yingyu/index_10.shtml',  # 2015-2025?
    'https://kaoyan.eol.cn/shiti/yingyu/index_1.shtml',
    'https://kaoyan.eol.cn/shiti/yingyu/index.shtml',
]

for url in urls_to_test:
    print(f"\n=== Testing {url} ===")
    html = get_html(url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        text = soup.get_text(separator='\n', strip=True)
        lines = text.split('\n')
        for line in lines[:100]:
            if any(k in line for k in ['Text', 'Passage', '阅读', '英语一', '英语二', '201', '真题']):
                print(f"LINE: {line.strip()}")
