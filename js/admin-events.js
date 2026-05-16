document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-event-form');
  const statusMsg = document.getElementById('status-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('publish-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Publishing...';
    btn.disabled = true;
    
    // Reset status message
    statusMsg.className = '';
    statusMsg.style.display = 'none';

    try {
      const name = document.getElementById('event-name').value;
      const date = document.getElementById('event-date').value || null;
      const location = document.getElementById('event-location').value;
      const description = document.getElementById('event-description').value;
      const imageFiles = document.getElementById('event-images').files;

      let imageUrls = [];

      // 1. Upload images if provided
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `public/${fileName}`;

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('event_images')
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('event_images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      }

      // 2. Insert into database
      const { error: dbError } = await supabase
        .from('events')
        .insert([
          {
            name,
            description,
            date,
            location,
            image_urls: imageUrls,
          }
        ]);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Success
      statusMsg.textContent = 'Event published successfully!';
      statusMsg.className = 'success';
      form.reset();

    } catch (err) {
      statusMsg.textContent = err.message;
      statusMsg.className = 'error';
    } finally {
      btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> Publish Event';
      btn.disabled = false;
      window.scrollTo(0, 0);
    }
  });
});
