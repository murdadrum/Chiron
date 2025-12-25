import os
import re

def extract_chapters(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for toctree-l1 items
    # Pattern: <li class="toctree-l1..."><a ...>(.*?)</a>
    # We need to be careful with nested tags if any, but usually titles are simple text inside <a>
    # The regex needs to handle potential attributes in <a> and <li>
    
    import html

    # Isolate the sidebar-tree div to avoid duplicates from other parts of the page
    start_marker = '<div class="sidebar-tree">'
    start_index = content.find(start_marker)
    if start_index != -1:
        # Find the closing div for sidebar-tree. 
        # Since we don't have a parser, and </div> is common, we can try to find the next <div class="main"> or assume it ends before "page" content.
        # However, checking the file structure, sidebar-tree is inside sidebar-scroll inside sidebar-container.
        # A simple way without matching braces is to look for the next distinct section or just take a large enough chunk, 
        # but regex on the whole file respecting the start index is better.
        content = content[start_index:]
    
    # Regex to capture the level (1, 2, 3...) and the title
    pattern = r'<li class="toctree-l(\d+)[^"]*">.*?<a class="reference internal" href="[^"]+">(.*?)</a>'
    
    matches = re.finditer(pattern, content, re.DOTALL)
    
    chapters = []
    seen_titles = set() # To handle potential duplicates if strict scoping fails
    
    for match in matches:
        level = int(match.group(1))
        raw_title = match.group(2).strip()
        title = html.unescape(raw_title)
        
        # Remove any HTML tags that might be inside the title (like <span>)
        title = re.sub(r'<[^>]+>', '', title)
        
        chapters.append((level, title))
        
    if not chapters:
        print("No chapters found.")
        return
    
    seen_top_level = set()
    final_chapters = []
    
    for level, title in chapters:
        # If we see a duplicate top-level chapter, assume we've hit a second menu (e.g. footer/mobile) and stop
        if level == 1:
            if title in seen_top_level:
                break
            seen_top_level.add(title)
        
        final_chapters.append((level, title))
        
    print("Blender 5.0 Manual Chapters:")
    for level, title in final_chapters:
        indent = "  " * (level - 1)
        print(f"{indent}- {title}")

if __name__ == "__main__":
    manual_path = "/Users/murdadrum/Blender/Docutorials/blender_manual_v500_en.html/index.html"
    extract_chapters(manual_path)
