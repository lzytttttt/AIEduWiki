#!/usr/bin/env python3
"""
Pre-build script: convert [[wikilinks]] to markdown links before MkDocs.
Wikilinks reference wiki page titles; this script resolves them to relative paths.
"""
import os, re, sys

WIKI_ROOT = os.path.join(os.path.dirname(__file__), '..', 'wiki')
WIKI_ROOT = os.path.abspath(WIKI_ROOT)

# Build a title -> (type, filename) map from existing pages
TITLE_MAP = {}  # lowercase title -> (section, filename_without_ext)

for section in ['entities', 'concepts', 'comparisons', 'queries']:
    dir_path = os.path.join(WIKI_ROOT, section)
    if not os.path.isdir(dir_path):
        continue
    for fname in os.listdir(dir_path):
        if fname.endswith('.md'):
            fpath = os.path.join(dir_path, fname)
            with open(fpath, encoding='utf-8') as f:
                content = f.read()
            m = re.search(r'^title:\s*(.+?)\s*$', content, re.M)
            if m:
                title = m.group(1).strip()
                base = fname[:-3]
                TITLE_MAP[title.lower()] = (section, base)

def resolve_wikilink(wikilink):
    parts = wikilink.split('|', 1)
    target = parts[0].strip()
    display = parts[1].strip() if len(parts) > 1 else target

    target_lower = target.lower()
    if target_lower in TITLE_MAP:
        section, base = TITLE_MAP[target_lower]
        return f'[{display}](../{section}/{base}/)'
    else:
        for title, (section, base) in TITLE_MAP.items():
            if target_lower in title or title in target_lower:
                return f'[{display}](../{section}/{base}/)'
        return f'[{display}]({target}/)'

def process_file(fpath):
    with open(fpath, encoding='utf-8') as f:
        content = f.read()

    code_blocks = []
    def remove_code(m):
        code_blocks.append(m.group(0))
        return f'\x00CODEBLOCK{len(code_blocks)-1}\x00'
    content_stripped = re.sub(r'```[\s\S]*?```', remove_code, content)
    content_stripped = re.sub(r'`[^`]*`', '', content_stripped)

    def replace_wikilink(m):
        wl = m.group(1)
        if wl.lower() in ('wikilinks', 'wikilink', 'page-name'):
            return m.group(0)
        return resolve_wikilink(wl)

    new_content = re.sub(r'\[\[([^\]]+?)\]\]', replace_wikilink, content_stripped)

    for i, cb in enumerate(code_blocks):
        new_content = new_content.replace(f'\x00CODEBLOCK{i}\x00', cb)

    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Processed: {fpath.replace(WIKI_ROOT, '')}")

def main():
    print("Pre-processing wikilinks...")
    for root, dirs, files in os.walk(WIKI_ROOT):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '_archive', 'raw', '.git', 'site')]
        for fname in files:
            if fname.endswith('.md') and fname not in ('mkdocs.yml', 'vercel.json'):
                fpath = os.path.join(root, fname)
                process_file(fpath)
    print("Done.")

if __name__ == '__main__':
    main()
