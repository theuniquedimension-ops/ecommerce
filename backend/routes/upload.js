const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME || 'placeholder',
    api_key: process.env.CLOUDINARY_CLIENT_API || 'placeholder',
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET || 'placeholder',
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload
router.post('/', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        cloudinary.uploader.upload(dataURI, { folder: 'luxe' }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ success: false, message: 'Upload failed' });
            }
            res.json({ success: true, url: result.secure_url });
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

module.exports = router;
