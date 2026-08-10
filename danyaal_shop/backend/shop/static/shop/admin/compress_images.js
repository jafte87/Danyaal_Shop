/**
 * Client-side image compression for Django Admin.
 * Compresses images in the browser before uploading — reduces a 3MB file to ~200KB
 * so the server never has to deal with large uploads.
 */
(function () {
    'use strict';

    const MAX_WIDTH = 1920;
    const JPEG_QUALITY = 0.85;
    const MIN_SIZE_TO_COMPRESS = 300 * 1024; // Only compress files > 300KB

    function compressImageFile(file, callback) {
        if (!file.type.startsWith('image/')) {
            callback(file);
            return;
        }
        if (file.size < MIN_SIZE_TO_COMPRESS) {
            callback(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                if (width > MAX_WIDTH) {
                    height = Math.round(height * MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }

                // Draw onto canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function (blob) {
                    const newName = file.name.replace(/\.[^.]+$/, '.jpg');
                    const compressed = new File([blob], newName, { type: 'image/jpeg' });
                    callback(compressed, file.size, blob.size);
                }, 'image/jpeg', JPEG_QUALITY);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showFeedback(input, origSize, newSize) {
        // Remove existing feedback
        const existing = input.closest('div')?.querySelector('.compress-feedback');
        if (existing) existing.remove();

        const origKB = Math.round(origSize / 1024);
        const newKB = Math.round(newSize / 1024);
        const saved = Math.round((1 - newSize / origSize) * 100);

        const msg = document.createElement('p');
        msg.className = 'compress-feedback';
        msg.style.cssText = 'color: #2e7d32; font-size: 12px; margin: 6px 0 0; font-weight: 500;';
        msg.textContent = `✓ Compressed: ${origKB}KB → ${newKB}KB (saved ${saved}%) — ready to save`;
        input.closest('div')?.appendChild(msg);
    }

    function attachToInput(input) {
        if (input.dataset.compressAttached) return;
        input.dataset.compressAttached = 'true';

        input.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            compressImageFile(file, function (compressed, origSize, newSize) {
                if (compressed === file) return; // No compression needed

                // Replace the file in the input
                try {
                    const dt = new DataTransfer();
                    dt.items.add(compressed);
                    input.files = dt.files;
                    showFeedback(input, origSize, newSize);
                } catch (err) {
                    // DataTransfer not supported (very old browsers) - skip
                }
            });
        });
    }

    function init() {
        // Attach to all existing file inputs
        document.querySelectorAll('input[type="file"]').forEach(attachToInput);

        // Attach to dynamically added inputs (e.g., inlines added via "Add another")
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        node.querySelectorAll?.('input[type="file"]').forEach(attachToInput);
                        if (node.tagName === 'INPUT' && node.type === 'file') {
                            attachToInput(node);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
