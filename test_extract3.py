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
                blocks.append((y0, y1, x0, text, len(block['lines'])))
        
        # Sort by vertical position (top to bottom), then horizontal
        blocks.sort(key=lambda x: (x[0], x[2]))
        
        # Determine page style: line blocks vs paragraph blocks
        text_blocks = [b for b in blocks if len(b[3]) > 10]
        if text_blocks:
            multi_line_count = sum(1 for b in text_blocks if b[4] > 1)
            single_line_count = sum(1 for b in text_blocks if b[4] == 1)
            is_paragraph_block_style = multi_line_count > single_line_count
        else:
            is_paragraph_block_style = False
        
        page_paragraphs = []
        current_para = []
        prev_y1 = None
        
        for y0, y1, x0, text, num_lines in blocks:
            if not text.strip():
                continue
            
            gap = y0 - prev_y1 if prev_y1 is not None else 0
            
            if is_paragraph_block_style:
                # Each block is likely a paragraph, unless gap is very small and text continues
                if prev_y1 is not None and gap < 3 and num_lines == 1:
                    # Very small gap, might be continuation
                    current_para.append(text)
                else:
                    if current_para:
                        para_text = ' '.join(current_para)
                        para_text = re.sub(r'\s+', ' ', para_text).strip()
                        if para_text:
                            page_paragraphs.append(para_text)
                        current_para = []
                    current_para.append(text)
            else:
                # Line block style: group by gap
                if prev_y1 is not None:
                    if gap > 5:
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


# Test with multiple years
for pdf_name in ['pdfs/2010-1.pdf', 'pdfs/2024-1.pdf', 'pdfs/2015-1.pdf', 'pdfs/2020-1.pdf']:
    paragraphs = extract_pdf_paragraphs(pdf_name)
    
    text_indices = {}
    for i, para in enumerate(paragraphs):
        m = re.match(r'^Text\s+(\d+)$', para, re.IGNORECASE)
        if m:
            text_indices[int(m.group(1))] = i
    
    print(f"\n=== {pdf_name} ===")
    for text_no, idx in text_indices.items():
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
        print(f"Text {text_no}: {len(text_paras)} paragraphs")
        for i, p in enumerate(text_paras[:5]):
            print(f"  Para {i+1}: {p[:150]}")
    
