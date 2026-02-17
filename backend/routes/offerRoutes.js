const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');

// Get all offers (Protected - Admin use)
router.get('/', auth, async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get active offers (Public - Homepage Display)
router.get('/active', async (req, res) => {
    try {
        const currentDate = new Date();
        const offers = await Offer.find({
            status: 'active',
            startDate: { $lte: currentDate },
            $or: [{ endDate: { $gte: currentDate } }, { endDate: null }]
        }).sort({ priorityOrder: 1, createdAt: -1 });
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new offer (Protected)
router.post('/', auth, async (req, res) => {
    try {
        // Sanitize input: Convert empty strings to null for unique/sparse fields
        const offerData = { ...req.body };
        if (offerData.voucherCode === '') delete offerData.voucherCode;
        if (offerData.promoCode === '') delete offerData.promoCode; // Optional cleanup

        const offer = new Offer({
            ...offerData,
            createdBy: req.user.userId
        });

        const newOffer = await offer.save();
        res.status(201).json(newOffer);
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Promo code or Voucher code already exists.' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Update offer (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        // Sanitize input
        const updateData = { ...req.body };
        if (updateData.voucherCode === '') updateData.voucherCode = null; // Use null for update to unset
        if (updateData.promoCode === '') updateData.promoCode = null;

        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.json(updatedOffer);
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Promo code or Voucher code already exists.' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Delete offer (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Increase usage count (Public/Protected - called when an order is placed)
// This endpoint would be called by the checkout process
router.post('/:id/use', auth, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Check global limit
        if (offer.totalUsageLimit && offer.totalUsageCount >= offer.totalUsageLimit) {
            return res.status(400).json({ message: 'Offer usage limit exceeded' });
        }

        // Increment usage
        offer.totalUsageCount += 1;

        // If voucher and single use
        if (offer.offerType === 'voucher' && offer.isSingleUse) {
            offer.status = 'inactive';
        }

        await offer.save();
        res.json({ message: 'Offer usage recorded', usageCount: offer.totalUsageCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
