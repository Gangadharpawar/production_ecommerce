import React from 'react'
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom'
const Categories = () => {
    const categories = useCategory()
    return (
        <Layout title={"All Categories"}>
            <div className="container">
                <div className="row">
                    {categories.map((c) => (
                        // <div className="col-md-6 mt-5 gx-3 gy-3" key={c._id} >
                        <div className="card text-center m-3 hover-bg" style={{ width: '18rem' }} key={c._id}>
                            <div className="card-body">
                                <Link to={`/category/${c.slug}`} style={{ textDecoration: "none", color: "black" }}>{c.name}</Link>
                            </div>
                        </div>))}

                </div>
            </div>
        </Layout>
    )
}

export default Categories
