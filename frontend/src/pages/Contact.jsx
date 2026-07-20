// frontend/src/pages/Contact.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/contact", formData);
      toast.success(res.data.message);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Get in Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Have a question, feedback, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-500 text-sm">hello@flavorfusion.example</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <FaPhone />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-500 text-sm">Remote-first, serving cooks worldwide</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="md:col-span-3 bg-white rounded-2xl shadow-sm p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.message ? (
                <p className="text-red-500 text-sm">{errors.message}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400">{formData.message.length}/1000</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;