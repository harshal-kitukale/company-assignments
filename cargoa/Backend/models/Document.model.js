const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  dateOfShipping: { type: String, required: true },
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  documentName: String,
});

module.exports = mongoose.model('Document', documentSchema);
