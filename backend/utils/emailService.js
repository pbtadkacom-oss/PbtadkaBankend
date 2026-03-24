const axios = require('axios');
require('dotenv').config();

/**
 * PB Tadka - Email Service
 * This now uses a Hostinger Proxy (PHP) to bypass Render SMTP blocks.
 */
const sendOtpEmail = async (to, otp) => {
    // --- SETTINGS ---
    // Make sure to add this to your Render Environment Variables!
    const PROXY_URL = 'https://pbtadka.com/send-otp.php'; 
    const SECRET_KEY = 'PBTadka_Secret_2026_Email_Key';

    console.log('[Email Service] Calling Hostinger Proxy for:', to);

    try {
        const response = await axios.post(PROXY_URL, {
            email: to,
            otp: otp,
            secret: SECRET_KEY
        }, {
            timeout: 10000 // 10s timeout
        });

        if (response.data && response.data.success) {
            console.log(`[Email Service] OTP sent successfully via Hostinger Proxy to ${to}`);
            return true;
        } else {
            console.error('[Email Service] Proxy Error:', response.data.message);
            return false;
        }
    } catch (err) {
        console.error('[Email Service] Network Error calling Proxy:', err.message);
        // If it's a 403, check the SECRET_KEY. If 404, check the PROXY_URL.
        return false;
    }
};

module.exports = { sendOtpEmail };
