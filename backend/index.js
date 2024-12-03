require("dotenv").config(); // Load .env variables
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API route to handle form submissions
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Email options
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,  
    subject: `Contact Form: ${subject}`, 
    text: message, 
    html: `<p><b>From:</b> ${name} (${email})</p><p><b>Subject:</b></p>${subject}<p><b>Message:</b></p><p>${message}</p>`, 
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
