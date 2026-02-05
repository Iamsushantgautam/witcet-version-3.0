const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const adminExists = await User.findOne({ email: 'admin@witcet.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new User({
            name: 'Super Admin',
            email: 'admin@witcet.com',
            password: 'adminpassword123', // Will be hashed by pre-save hook
            role: 'admin',
            status: 'Active'
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@witcet.com');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
