const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    // Common fields
    title: { type: String, required: true },
    description: String,

    // Type: Offer, PromoCode, Voucher
    // But user grouped them. We'll use "offerType" to distinguish.
    // 'Percentage', 'Fixed Amount', 'Voucher' are payment/deduction types.
    // Let's add 'type' to distinguish generic Offers from user-specific Vouchers if needed
    // or rely on 'offerType' as requested: "percentage, fixed amount, or voucher"
    offerType: {
        type: String,
        enum: ['percentage', 'fixed_amount', 'voucher'],
        required: true
    },

    // Identifiers
    promoCode: { type: String, trim: true, uppercase: true }, // For generic codes like SAVE20
    additionalPromoCodes: [{
        code: { type: String, required: true, uppercase: true, trim: true },
        expiryDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        usageCount: { type: Number, default: 0 },
        // Per-code overrides
        discountValue: { type: Number },
        minPurchaseAmount: { type: Number },
        totalUsageLimit: { type: Number },
        startDate: { type: Date }
    }],
    voucherCode: { type: String, trim: true, unique: true, sparse: true }, // For specific vouchers, sparse allows nulls to be non-unique

    // Value
    discountValue: { type: Number, required: true }, // % or Fixed Amount
    maxDiscountLimit: { type: Number }, // If percentage based
    minPurchaseAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },

    // Voucher Specific
    balanceAmount: { type: Number }, // Remaining balance if partial use allowed
    isSingleUse: { type: Boolean, default: false }, // "single use or multi use flag"

    // Eligibility & Applicability
    applicableCategories: [{ type: String }], // Array of category names/IDs
    applicableCourses: [{ type: String }], // Array of course names/IDs
    userEligibility: {
        type: String,
        enum: ['all', 'new_users', 'existing_users'],
        default: 'all'
    },

    // Date & Active Status
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

    // Limits
    totalUsageLimit: { type: Number }, // Global limit
    perUserUsageLimit: { type: Number, default: 1 }, // Per user limit
    totalUsageCount: { type: Number, default: 0 }, // Tracking

    // UI Display
    bannerImage: { type: String }, // URL from Cloudinary
    redeemLink: { type: String }, // The link to redirect to on "Redeem"
    redeemSteps: { type: String }, // Instructions on how to redeem
    offerDetails: { type: String }, // Detailed terms or description
    priorityOrder: { type: Number, default: 0 }, // For homepage display sorting

    // Meta
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true // Adds createdAt, updatedAt automatically
});

// Middleware to update status based on date (optional, but good for query time)
offerSchema.pre('save', async function () {
    if (this.endDate && this.endDate < new Date()) {
        this.status = 'inactive';
    }
});

module.exports = mongoose.model('Offer', offerSchema);
