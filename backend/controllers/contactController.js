// backend/controllers/contactController.js
import Contact from "../models/Contact.js";

// @route   POST /api/contact
// @desc    Submit a contact form message (public — no login required)
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "Thanks for reaching out! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error.message);
    res.status(500).json({ message: "Server error while submitting your message" });
  }
};