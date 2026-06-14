import fitz
import re
import json
import os

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
        
        page_paragraphs = []
        current_para = []
        prev_y1 = None
        
        for y0, y1, x0, text in blocks:
            if not text.strip():
                continue
            gap = y0 - prev_y1 if prev_y1 is not None else 0
            if prev_y1 is not None and gap > 5:
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


def extract_text_sections(paragraphs, paper_id):
    """Extract Text 1-4 sections from paragraphs."""
    texts = {1: [], 2: [], 3: [], 4: []}
    current_text = 0
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        # Check if this is a text marker
        text_match = re.match(r'^Text\s+(\d+)\s*$', para, re.IGNORECASE)
        if text_match:
            text_no = int(text_match.group(1))
            if 1 <= text_no <= 4:
                current_text = text_no
            continue
        
        # Check if we hit a question or section marker
        if re.match(r'^\d+\.', para) or para.startswith('Section ') or para.startswith('Part B'):
            # If we hit a question number and we're in a text, we might want to stop
            # But some questions might be on the same page, so we only stop if the text is long enough
            # Actually, let's just mark this as end of current text
            if current_text > 0:
                # Don't add question paragraphs to text
                pass
            continue
        
        if current_text > 0 and current_text <= 4:
            texts[current_text].append(para)
    
    return texts


def split_sentences(text):
    """Split text into sentences by periods, but handle common exceptions."""
    # Handle abbreviations like Mr., Mrs., Dr., etc.
    text = re.sub(r'(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|Inc|Ltd|Co|vs|vol|pp|et al|i\.e|e\.g|a\.m|p\.m|No)\.', r'\1<PERIOD>', text)
    
    # Split by sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s.replace('<PERIOD>', '.').strip() for s in sentences if s.strip()]
    return sentences


# Test with 2024-1
pdf_path = 'pdfs/2024-1.pdf'
paragraphs = extract_pdf_paragraphs(pdf_path)

# Find where Text sections start
text_indices = {}
for i, para in enumerate(paragraphs):
    m = re.match(r'^Text\s+(\d+)$', para, re.IGNORECASE)
    if m:
        text_indices[int(m.group(1))] = i

print("Text indices:", text_indices)
print(f"Total paragraphs: {len(paragraphs)}")

for text_no, idx in text_indices.items():
    print(f"\n=== Text {text_no} ===")
    # Get all paragraphs until next Text or end
    start = idx + 1
    end = len(paragraphs)
    for next_text in range(text_no + 1, 5):
        if next_text in text_indices:
            end = text_indices[next_text]
            break
    
    text_paras = paragraphs[start:end]
    # Filter out question paragraphs (starting with number + dot)
    text_paras = [p for p in text_paras if not re.match(r'^\d+\.', p) and not p.startswith('Section') and not p.startswith('Part B')]
    
    for i, p in enumerate(text_paras[:8]):
        print(f"Para {i+1}: {p[:150]}")
