import os, glob, re

src = r'd:\Ok\laundry\phone_shop\danyaal_shop\frontend\src'
files = glob.glob(os.path.join(src, '**', '*.jsx'), recursive=True) + glob.glob(os.path.join(src, '**', '*.js'), recursive=True)

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    # Fix bad backslash import paths
    if '..\config' in content or '..\\config' in content:
        content = content.replace('..\\config', '../config').replace('..\config', '../config')
        changed = True
    
    # Fix remaining hardcoded localhost URLs
    if 'http://127.0.0.1:8000' in content:
        # Replace 'http://127.0.0.1:8000/...' or "http://..." with backtick template
        content = re.sub(r"['\"]http://127\.0\.0\.1:8000([^'\"]*)['\"]", r'`${API_BASE_URL}\1`', content)
        changed = True
    
    if changed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {os.path.relpath(fp, src)}')

print('Done!')
