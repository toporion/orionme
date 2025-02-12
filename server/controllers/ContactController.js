const ContactModel = require("../models/ContactModel");
const nodemailer = require('nodemailer');

// Nodemailer setup with your email credentials
const transporter = nodemailer.createTransport({
    host: 'mail.toporionbd.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: 'rokon@toporionbd.com',
        pass: '$#@1602301239' // Be careful with plain text credentials in production
    }
});

const sendEmail = async (data) => {
    const mailOptions = {
        from: 'rokon@toporionbd.com', // Your email address
        to: 'rokon@toporionbd.com', // Receiver email address
        subject: 'New Contact Form Submission', // Email subject
        text: `You received a new message from ${data.name} (${data.email}).\n\nMessage:\n${data.message}`, // Plain text body
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong> ${data.message}</p>
        ` // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log("Received Data:", req.body);

     

        // Save the contact in the database
        const newContact = await ContactModel({ name, email, message });
        await newContact.save();

        // Send the email
        await sendEmail({ name, email, message });

        // Send the response
        res.status(201).json({
            success: true,
            message: "Contact saved successfully and email sent",
            data: newContact,
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server issue",
        });
    }
};

module.exports = { createContact };
