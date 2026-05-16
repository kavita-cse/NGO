document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-post-form');
  const statusMsg = document.getElementById('post-status-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('publish-post-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Publishing...';
    btn.disabled = true;
    
    // Reset status message
    statusMsg.className = '';
    statusMsg.style.display = 'none';

    try {
      const program_name = document.getElementById('post-program').value;
      const caption = document.getElementById('post-caption').value;
      const imageFiles = document.getElementById('post-images').files;

      if (!program_name) throw new Error("Please select a program name.");
      if (imageFiles.length === 0) throw new Error("Please select at least one image.");

      let imageUrls = [];

      // 1. Upload images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // 2. Insert into database
      const { error: dbError } = await supabase
        .from('posts')
        .insert([
          {
            program_name,
            caption,
            image_urls: imageUrls,
          }
        ]);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Success
      statusMsg.textContent = 'Post published successfully!';
      statusMsg.className = 'success';
      form.reset();

    } catch (err) {
      statusMsg.textContent = err.message;
      statusMsg.className = 'error';
    } finally {
      btn.innerHTML = '<i class="fas fa-camera mr-1"></i> Publish Post';
      btn.disabled = false;
    }
  });
});
