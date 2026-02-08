import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dkdp9sjty',
    api_key: '936869397196939',
    api_secret: 'AG_0gaj3sef4PcRcvXtJXkcIq7I',
});

const publicId = 'hiictpark/design-template-files/1770576688889-white-circle-frame-with-shadow-free-png.zip';

const signedUrl = cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600
});

console.log('Signed URL:', signedUrl);
