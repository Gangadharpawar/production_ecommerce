import React from 'react'
import Layout from './../components/Layout/Layout';

const AboutPage = () => {
  return (
    <Layout title={"About us"}>
      <div classname="container">
        <div className="row contactus ">
          <div className="col-md-6 ">
            <img
              src="/images/about.jpeg"
              alt="contactus"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-md-4">
            <p className="text-justify mt-2">
              <h1>About Us</h1>
              <p classname="text-muted">Learn more about our journey and what makes us stand out in the e-commerce world.</p>
              <h2>Our Story</h2>

              <p>
                We started our journey with a simple goal: to provide the best online shopping experience.
                With a wide range of products, fast shipping, and exceptional customer support, we have grown into
                a trusted name in the e-commerce industry.
              </p>
              <p>
                Our team is passionate about bringing you the latest trends and high-quality products at
                unbeatable prices. We believe in building long-term relationships with our customers by offering
                exceptional service and support.
              </p>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage
