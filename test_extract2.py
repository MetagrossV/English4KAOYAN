import fitz
import re
import json
import os
from statistics import median

def extract_pdf_paragraphs(pdf_path):
    """Extract paragraphs from a PDF with proper paragraph boundary detection."""
    doc = fitz.open(pdf_path)
    all_paragraphs = []
    
    for page_num, page in enumerate(doc):
        dict_data = page.get_text('dict')
        blocks = []
        for block in dict_data['blocks']:
            if 'lines' in block:
                y0 = block['bbox'][1]
                y1 = block['bbox'][3]
                x0 = block['bbox'][0]
                lines = []
                for line in block['lines']:
                    text = ''.join([span['text'] for span in line['spans']])
                    lines.append(text)
                text = ' '.join(lines)
                blocks.append((y0, y1, x0, text))
        
        # Sort by vertical position (top to bottom), then horizontal
        blocks.sort(key=lambda x: (x[0], x[2]))
        
        # Calculate dynamic threshold for this page
        gaps = []
        for i in range(1, len(blocks)):
            gap = blocks[i][0] - blocks[i-1][1]
            if gap > 0 and gap < 20:  # reasonable line spacing range
                gaps.append(gap)
        
        if gaps:
            line_spacing = median(gaps)
            threshold = max(line_spacing * 2, 6)  # at least 6 points
        else:
            threshold = 6
        
        page_paragraphs = []
        current_para = []
        prev_y1 = None
        
        for y0, y1, x0, text in blocks:
            if not text.strip():
                continue
            gap = y0 - prev_y1 if prev_y1 is not None else 0
            if prev_y1 is not None and gap > threshold:
                if current_para:
                    para_text = ' '.join(current_para)
                    para_text = re.sub(r'\s+', ' ', para_text).strip()
                    if para_text:
                        page_paragraphs.append(para_text)
                    current_para = []
            current_para.append(text)
            prev_y1 = y1
        
        if current_para:
            para_text = ' '.join(current_para)
            para_text = re.sub(r'\s+', ' ', para_text).strip()
            if para_text:
                page_paragraphs.append(para_text)
        
        all_paragraphs.extend(page_paragraphs)
    
    doc.close()
    return all_paragraphs


# Test with 2010-1
pdf_path = 'pdfs/2010-1.pdf'
paragraphs = extract_pdf_paragraphs(pdf_path)

text_indices = {}
for i, para in enumerate(paragraphs):
    m = re.match(r'^Text\s+(\d+)$', para, re.IGNORECASE)
    if m:
        text_indices[int(m.group(1))] = i

for text_no, idx in text_indices.items():
    print(f"\n=== Text {text_no} ===")
    start = idx + 1
    end = len(paragraphs)
    for next_text in range(text_no + 1, 5):
        if next_text in text_indices:
            end = text_indices[next_text]
            break
    text_paras = paragraphs[start:end]
    # Find first question
    first_q_idx = None
    for j, p in enumerate(text_paras):
        if re.match(r'^\d{2}\.', p):
            first_q_idx = j
            break
    if first_q_idx is not None:
        text_paras = text_paras[:first_q_idx]
    for i, p in enumerate(text_paras):
        print(f"Para {i+1}: {p[:200]}")
