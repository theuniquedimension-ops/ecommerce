const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER) {
        console.warn('EMAIL_USER not set. Cannot send email to:', options.to);
        return;
    }
    const mailOptions = {
        from: `Luxe Store <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.to}`);
    } catch (err) {
        console.error('Email sending failed:', err.message);
    }
};

module.exports = sendEmail;
