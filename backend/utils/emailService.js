const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOtpEmail = async (to, otp) => {
    // Port 587 (STARTTLS) + forcing IPv4 to resolve TIMEOUT/ENETUNREACH issues on Render
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Force IPv4 to avoid Render's broken IPv6 routing
        family: 4,
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false,
            // also try forcing IPv4 in TLS options
            family: 4
        },
        connectionTimeout: 30000, // 30s
        greetingTimeout: 30000,
        socketTimeout: 30000
    });

    // Diagnostic check
    console.log('[Email Service] Config Check:', {
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS,
        nodeEnv: process.env.NODE_ENV,
        port: 587
    });

    const mailOptions = {
        from: `"PB Tadka" <${process.env.EMAIL_USER}>`,
        to,
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
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] OTP sent to ${to}`);
        return true;
    } catch (err) {
        console.error('[Email Service] Error sending email:', err);
        return false;
    }
};

module.exports = { sendOtpEmail };
