const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authentication.middleware');
const Document = require('../models/Document.model');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'../uploads'); 
  },
  filename: function (req, file, cb) {
  
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/submit-document', authMiddleware, upload.single('pdfFile'), async (req, res) => {
  try {
    const { productName, quantity, dateOfShipping, vendorIds } = req.body;
    const pdfFile = req.file;

    // Create a new document
    const document = new Document({
      userId: req.user._id,
      productName,
      quantity,
      dateOfShipping,
      vendors: vendorIds,
      documentName: pdfFile.filename,
    });

    // Save the document to the database
    await document.save();

    res.status(201).json({ message: 'Document submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/vendor-documents', authMiddleware, async (req, res) => {
  try {
    const vendorId = req.user._id;

    const vendorDocuments = await Document.find({ vendors: vendorId });

    res.status(200).json({ documents: vendorDocuments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
