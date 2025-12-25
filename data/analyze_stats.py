import os
import re
import html

def analyze_manual(root_dir):
    total_files = 0
    total_lines = 0
    total_words = 0
    total_images = 0

    # Walk through the directory
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude static/system directories
        if any(excluded in dirpath for excluded in ['_static', '_images', '_sources']):
            continue

        for filename in filenames:
            if not filename.endswith('.html'):
                continue
            
            # Exclude non-content pages
            if filename in ['genindex.html', 'search.html', 'copyright.html', 'index.html']:
                 # Check if it's the root index.html, usually we might want to skip it as it's just TOC
                 # But some section indices might have content. Let's skip the ROOT index specifically if we can distinguish,
                 # or just generic index pages if they are small.
                 # For now, let's keep it simple and skip obvious non-content.
                 if filename != 'index.html': # Skip aux files
                     continue
                 # If it is index.html, we check if it's the root one or a subdir one.
                 # Actually, subdir index.html often has "Introduction" text so we might want it.
                 # Let's just exclude the root index.html specifically?
                 if dirpath == root_dir and filename == 'index.html':
                     continue

            file_path = os.path.join(dirpath, filename)
            total_files += 1

            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # 1. Count Images (in the whole file? or just content? usually just content matters but images in sidebar are rare/logos)
            # Let's count all images first, or maybe restrict to content if possible.
            # But simpler to just strip sidebar text since that's the word count inflator.
            
            # Remove scripts and styles first
            content = re.sub(r'<script[^>]*>.*?</script>', ' ', content, flags=re.DOTALL)
            content = re.sub(r'<style[^>]*>.*?</style>', ' ', content, flags=re.DOTALL)
            
            # Remove sidebar and header (common in Furo/Sphinx)
            # <aside class="sidebar-drawer"> ... </aside>
            # <header class="mobile-header"> ... </header>
            # We use non-greedy matching.
            content = re.sub(r'<aside class="sidebar-drawer">.*?</aside>', ' ', content, flags=re.DOTALL)
            content = re.sub(r'<header class="mobile-header">.*?</header>', ' ', content, flags=re.DOTALL)
            # Also often a right sidebar for TOC
            content = re.sub(r'<aside class="toc-drawer">.*?</aside>', ' ', content, flags=re.DOTALL)
            
            # Remove comments
            content = re.sub(r'<!--.*?-->', ' ', content, flags=re.DOTALL)
            
            # 1. Count Images (approximate after stripping sidebars which might contain logos)
            images = re.findall(r'<img[^>]+>', content)
            total_images += len(images)

            # Remove HTML tags
            text = re.sub(r'<[^>]+>', ' ', content)
            
            # Unescape HTML
            text = html.unescape(text)

            # Normalize whitespace
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            
            # Filter out navigation/footer noise if possible. 
            # Often "Next", "Previous", "Copyright" etc are at specific places.
            # But specific filtering is hard without parsing specific divs.
            # We will just count everything as "text content" for now, noting it's an upper bound.
            
            file_lines = len(lines)
            file_words = sum(len(line.split()) for line in lines)

            total_lines += file_lines
            total_words += file_words

    print(f"--- Analysis Results ---")
    print(f"Total Content Files: {total_files}")
    print(f"Total Images: {total_images}")
    print(f"Total Non-Empty Lines: {total_lines}")
    print(f"Total Words: {total_words}")
    
    # Estimates
    # 500 words per page (single spaced standard)
    # 3 images per page (mixed with text)
    
    text_pages = total_words / 500
    image_pages = total_images / 3
    total_pages = text_pages + image_pages
    
    print(f"\n--- Estimates (8.5x11 pages) ---")
    print(f"Text Pages (~500 words/page): {text_pages:.1f}")
    print(f"Image Pages (~3 imgs/page): {image_pages:.1f}")
    print(f"Total Estimated Pages: {total_pages:.1f}")

if __name__ == "__main__":
    manual_path = "/Users/murdadrum/Blender/Docutorials/blender_manual_v500_en.html"
    analyze_manual(manual_path)
