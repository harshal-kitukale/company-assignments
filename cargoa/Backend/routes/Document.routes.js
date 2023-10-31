const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authentication.middleware');
const Document = require('../models/Document.model');

router.post('/submit-document', authMiddleware, async (req, res) => {
  try {
    const { productName, quantity, dateOfShipping, vendors } = req.body;

    // Create a new document
    const document = new Document({
      userId: req.user._id,
      productName,
      quantity,
      dateOfShipping,
      vendors,
    });

    // Save the document to the database
    await document.save();

    res.status(201).json({ message: 'Document submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
