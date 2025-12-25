import json
import re

def parse_markdown_to_json(md_path, json_path):
    root = []
    stack = [{"level": 0, "children": root}]

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line in lines:
        line = line.rstrip()
        if not line:
            continue
        
        # Determine indentation level (2 spaces per level)
        # We assume the file is formatted with "- Title"
        # Level 1: "- Title" (0 spaces indent, but let's count spaces)
        # Level 2: "  - Title" (2 spaces)
        
        match = re.match(r'^(\s*)-\s+(.*)', line)
        if not match:
            continue
            
        indent_str = match.group(1)
        title = match.group(2)
        
        # Calculate level. Assumes 2 space indent.
        indent_len = len(indent_str)
        level = (indent_len // 2) + 1
        
        node = {"title": title, "children": []}
        
        # Find the correct parent
        while stack[-1]["level"] >= level:
            stack.pop()
        
        parent = stack[-1]
        parent["children"].append(node)
        stack.append({"level": level, "children": node["children"], "node": node})

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(root, f, indent=2)
    
    print(f"Converted {md_path} to {json_path}")

if __name__ == "__main__":
    parse_markdown_to_json('data/blender_chapters.md', 'web/src/assets/chapters.json')
