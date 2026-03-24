const axios = require('axios');
require('dotenv').config();

/**
 * PB Tadka - Email Service
 * This now uses Resend API to bypass all Render SMTP blocks.
 */
const sendOtpEmail = async (to, otp) => {
    // Domain verify ho chuka hai, ab professional email use kar sakte hain
    const SENDER = 'PB Tadka <noreply@pbtadka.com>';
    const API_KEY = 're_4T4D7ZLt_MVn11CzDfHHbTJrLy8uSSuBV';

    console.log('[Email Service] Calling Resend API for:', to);

    try {
        const response = await axios.post('https://api.resend.com/emails', {
            from: SENDER,
            to: to,
            subject: 'Verification Code for PB Tadka',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #e11d48; text-align: center;">PB Tadka Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for choosing PB Tadka. Please use the following One-Time Password (OTP) to proceed:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0; border-radius: 8px;">
                        ${otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 10px; color: #aaa; text-align: center;">&copy; 2026 PB Tadka. All rights reserved.</p>
                </div>
            `
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            console.log(`[Email Service] OTP sent successfully via Resend to ${to}`);
            return true;
        } else {
            console.error('[Email Service] Resend Error:', response.data);
            return false;
        }
    } catch (err) {
        console.error('[Email Service] Error calling Resend:', err.response ? err.response.data : err.message);
        return false;
    }
};

module.exports = { sendOtpEmail };
