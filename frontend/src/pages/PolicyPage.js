import React from 'react'
import Layout from './../components/Layout/Layout';

const PolicyPage = () => {
  return (
    <Layout title={" Privacy Policy"}>
      <div className="row contactus ">
        <h1 className='text-center'>About Us</h1>
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">

            <h5 className="card-title">Privacy Policy</h5>
            <p> We value your privacy and are committed to protecting your personal information. Our privacy policy explains how we collect, use, and safeguard your data.</p>
            <h5 className="card-title">Return & Refund Policy</h5>
            <p>We strive to ensure customer satisfaction with every purchase. If you are not happy with your order, learn about our easy return and refund policies.</p>
            <h5 className="card-title">Shipping Policy</h5>
            <p>  We offer fast and reliable shipping to ensure your products reach you on time. Learn about our shipping methods and delivery timelines.</p>
          </p>
        </div>
      </div>

    </Layout>
  )
}

export default PolicyPage
