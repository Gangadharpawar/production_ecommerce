import React from 'react'
import Layout from './../components/Layout/Layout';
import { Link } from "react-router-dom";
const PageNotfound = () => {
  return (
    <Layout title={"Page Not Found"}>
      <div className="container text-center my-5">
        <div className="py-5">
          <h1 className="display-1 text-danger">404</h1>
          <h2>Page Not Found</h2>
          <p className="text-muted">Sorry, the page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">Go Back to Home</Link>
        </div>
      </div>
    </Layout>
  )
}

export default PageNotfound
