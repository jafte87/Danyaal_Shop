import os, glob, re

src = r'd:\Ok\laundry\phone_shop\danyaal_shop\frontend\src'
files = glob.glob(os.path.join(src, '**', '*.jsx'), recursive=True) + glob.glob(os.path.join(src, '**', '*.js'), recursive=True)

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match ${API_BASE_URL}... up to the closing quote (either single or double)
    new_content = re.sub(r"\$\{API_BASE_URL\}([^'\"]*)['\"]", r"`${API_BASE_URL}\1`", content)
    
    if new_content != content:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed: {os.path.relpath(fp, src)}')

print('Done!')
