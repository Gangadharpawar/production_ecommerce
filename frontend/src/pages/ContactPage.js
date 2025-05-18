import React, { useState } from 'react'
import Layout from './../components/Layout/Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name,
        email,
        message,
      };
      const { data } = await axios.post(`/api/v1/auth/enquire-mail`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (data?.success) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Fail to send mail !");

      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to Send message .Please try again");
    }
  }
  return (
    <Layout title={"Contact us"}>
      <div className="container mt-5">
        <div className="contact-header text-center py-4 bg-light">
          <h1>Contact Us</h1>
          <p>We would love to hear from you. Please fill out the form below to get in touch.</p>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="p-4 bg-light rounded">
              <h5>Our Office</h5>
              <p>123 Ecommerce St, Business City Pune, India</p>
              <p><strong>Email:</strong> support@ecommerce.com</p>
              <p><strong>Phone:</strong> +123 456 7890</p>
              <p><strong>Business Hours:</strong> Mon - Fri, 9 AM - 6 PM</p>
            </div>
            <div className="p-4 bg-light rounded mt-4">
              <h5>Follow Us</h5>
              <Link to="#" className="btn btn-primary btn-sm me-2">Facebook</Link>
              <Link to="#" className="btn btn-info btn-sm me-2">Twitter</Link>
              <Link to="#" className="btn btn-danger btn-sm">Instagram</Link>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="p-4 bg-white shadow-sm rounded">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Your Email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="5" placeholder="Your Message"
                    value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage
