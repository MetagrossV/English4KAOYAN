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

# Save a sample page to inspect
url = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211034.shtml'
html = get_html(url)
if html:
    with open('sample_page.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved sample_page.html")

# Also try the 2010-2014 English 2 summary
url2 = 'https://kaoyan.eol.cn/fu_xi/yingyu/201412/t20141208_1211049.shtml'
html2 = get_html(url2)
if html2:
    with open('sample_page2.html', 'w', encoding='utf-8') as f:
        f.write(html2)
    print("Saved sample_page2.html")

# Also save the shiti index page
url3 = 'https://kaoyan.eol.cn/shiti/yingyu/index.shtml'
html3 = get_html(url3)
if html3:
    with open('sample_index.html', 'w', encoding='utf-8') as f:
        f.write(html3)
    print("Saved sample_index.html")
