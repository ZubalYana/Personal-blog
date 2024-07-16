document.getElementById('profile-pic').addEventListener('change', function(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const max_size = 100; // Adjust this value as needed
                let width = img.width;
                let height = img.height;

                // Calculate the new dimensions
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }

                // Resize the image using canvas
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert the canvas back to a data URL
                const resizedDataUrl = canvas.toDataURL('image/jpeg');
                document.getElementById('profile-pic-preview').src = resizedDataUrl;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
});
