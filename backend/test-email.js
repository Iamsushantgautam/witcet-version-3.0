const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.BREVO_API_KEY;

if (!API_KEY) {
    console.error('ERROR: BREVO_API_KEY is missing in .env file!');
    process.exit(1);
}

const sendTestEmail = async (recipientEmail) => {
    console.log('Using API Key:', API_KEY ? `Present (starts with ${API_KEY.substring(0, 5)}...)` : 'Missing');
    console.log('Sending test email to:', recipientEmail);

    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: 'Witcet Test', email: 'no-reply@witcet.online' },
            to: [{ email: recipientEmail }],
            subject: 'Witcet Test Email',
            htmlContent: '<p>This is a test email from the Witcet backend script to verify Brevo configuration.</p>'
        }, {
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            }
        });

        console.log('SUCCESS: Email sent!');
        console.log('Response ID:', response.data.messageId);
    } catch (error) {
        console.error('FAILURE: Could not send email.');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

const args = process.argv.slice(2);
const recipient = args[0];

if (!recipient) {
    console.log('Usage: node backend/test-email.js <recipient-email>');
    process.exit(1);
}

sendTestEmail(recipient);
