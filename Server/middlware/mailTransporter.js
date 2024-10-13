// middleware/mailTransporter.js
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service
    auth: {
        user: 'tailothservice@gmail.com',
        pass: 'xzqdcenkqtfovjbv',
    },
});

// Function to send mail
const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: 'tailothservice@gmail.com',
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to handle it in the controller
    }
};

module.exports = { sendEmail };
