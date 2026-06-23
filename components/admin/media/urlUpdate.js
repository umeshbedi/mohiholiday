export function updateCloudinaryWidth(url, newWidth = 300) {
    const parts = url.split('/upload/');

    if (parts.length !== 2) {
      console.error("Invalid Cloudinary URL");
      return url;
    }
  
    const [baseUrl, rest] = parts;
  
    const restParts = rest.split('/');
    let transformationIndex = 0;
  
    // Check if first part after 'upload/' is a transformation (not starting with 'v' or image folder)
    if (!restParts[0].startsWith('v') && !restParts[0].endsWith('.jpg')) {
      let transformations = restParts[0];
  
      // Update width if w_ already exists, else add it
      if (transformations.includes('w_')) {
        transformations = transformations.replace(/w_\d+/, `w_${newWidth}`);
      } else {
        transformations = `w_${newWidth},${transformations}`;
      }
  
      restParts[0] = transformations;
    } else {
      // Insert new transformation as first part
      restParts.unshift(`w_${newWidth}`);
    }
  
    const transformedUrl = `${baseUrl}/upload/${restParts.join('/')}`;
    return transformedUrl;
  }
  