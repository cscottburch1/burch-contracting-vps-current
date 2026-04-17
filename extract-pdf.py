#!/usr/bin/env python3
"""Extract text from PDF audit report"""

import sys

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("Installing pypdf...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "--quiet"])
        from pypdf import PdfReader

def extract_text_from_pdf(pdf_path, output_path):
    """Extract all text from PDF and save to text file"""
    reader = PdfReader(pdf_path)
    
    full_text = []
    full_text.append(f"PDF: {pdf_path}")
    full_text.append(f"Total Pages: {len(reader.pages)}")
    full_text.append("="*80)
    full_text.append("")
    
    for page_num, page in enumerate(reader.pages, 1):
        text = page.extract_text()
        full_text.append(f"--- PAGE {page_num} ---")
        full_text.append(text)
        full_text.append("")
    
    output_text = "\n".join(full_text)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_text)
    
    print(f"Extracted {len(reader.pages)} pages to {output_path}")
    return output_text

if __name__ == "__main__":
    pdf_file = "geo-audit-report.pdf"
    output_file = "geo-audit-report.txt"
    
    extract_text_from_pdf(pdf_file, output_file)
