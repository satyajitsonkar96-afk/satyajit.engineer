const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SendGrid Configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, title } = req.body;

    const msg = {
        to: process.env.RECEIVER_EMAIL, // Your email where you want to receive messages
        from: process.env.SENDER_EMAIL, // Verified sender email in SendGrid
        subject: `New Portfolio Message: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nTitle: ${title}\n\nMessage:\n${message}`,
        html: `
            <h3>New Message from Portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('SendGrid Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.get('/', (req, res) => {
    res.send('Portfolio Backend is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
