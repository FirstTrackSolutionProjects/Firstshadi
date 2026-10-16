import multer from 'multer';

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed'), false);
  }
};

// Create upload middleware
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Multiple file upload
export const uploadPhotos = upload.array('photos', 10);

// Single file upload
export const uploadSingle = upload.single('photo');

export default { upload, uploadPhotos, uploadSingle };
