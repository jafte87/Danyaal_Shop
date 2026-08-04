import os
import glob

# Path to the src directory
src_dir = r'd:\Ok\laundry\phone_shop\danyaal_shop\frontend\src'

# Files to update
files = glob.glob(os.path.join(src_dir, '**', '*.jsx'), recursive=True) + glob.glob(os.path.join(src_dir, '**', '*.js'), recursive=True)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '127.0.0.1:8000' in content:
        # Determine relative path to config.js
        # config.js is in src/config.js
        rel_path = os.path.relpath(os.path.join(src_dir, 'config'), os.path.dirname(file_path)).replace('\\\\', '/')
        if rel_path == 'config':
            rel_path = './config'
            
        import_stmt = f"import {{ API_BASE_URL }} from '{rel_path}'\n"
        
        # Add import if not present
        if 'API_BASE_URL' not in content:
            # Find the last import statement to insert after
            lines = content.split('\n')
            last_import_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import_idx = i
            
            lines.insert(last_import_idx + 1, import_stmt.strip())
            content = '\n'.join(lines)
            
        # Replace occurrences
        # We assume they are in fetch('http://127.0.0.1:8000/...')
        # We need to replace 'http://127.0.0.1:8000/api...' with ${API_BASE_URL}/api...
        # and change the surrounding quotes from single/double to backticks.
        # It's easier to just do simple string replacement:
        content = content.replace("'http://127.0.0.1:8000", "${API_BASE_URL}")
        content = content.replace('"http://127.0.0.1:8000', "${API_BASE_URL}")
        
        # We must also ensure the closing quote is replaced with a backtick
        # but that requires regex.
        import re
        content = re.sub(r"(['\"])http://127\.0\.0\.1:8000([^'\"]*)\1", r"${API_BASE_URL}\2", content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

