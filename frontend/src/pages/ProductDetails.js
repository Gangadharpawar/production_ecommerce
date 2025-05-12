import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cart';
import toast from "react-hot-toast";
const ProductDetails = () => {
    const params = useParams();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([])
    //get Products 
    //inital details

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug])
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProducts(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error);
        }
    }


    //get similar Products
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)

        } catch (error) {
            console.log(error)
        }
    }


    if (!product) {
        return (
            <Layout>
                <div className="text-center mt-5">
                    <h2>Loading Product...</h2>
                </div>
            </Layout>
        );
    }
    return (
        <Layout>
            {/* {JSON.stringify(product, null, 4)} */}
            <div className="row container mt-2">
                <div className="col-md-4">
                    <img src={`/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} height={'300px'} width={'350px'} />
                </div>
                <div className="col-md-6 ">
                    <h1>Product Details</h1>
                    <h3>Name :{product.name}</h3>
                    <h6>Description :{product.description}</h6>
                    <h6>Category :{product.category?.name}</h6>
                    <h4>Price :₹{product.price}</h4>
                    <h5>Shipping :{product.shipping ? 'Available' : 'Not Available'}</h5>
                    <button className="btn btn-dark btn-sm " onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem('cart', JSON.stringify([...cart, product])); toast.success("iteam added to cart");
                    }} >Add to cart </button>
                </div>


            </div>
            <div className="row container mt-4">
                <h2>Similar Category Products</h2>
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((p) => (
                        <div key={p._id} className="col-md-4 mb-3">
                            <div className="card">
                                <img
                                    src={`/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top img-fluid"
                                    alt={p.name}
                                    max-width={"100 %"} height={"auto"}
                                />
                                <div className="card-body">
                                    <span style={{ fontWeight: "bold" }}>Name :{p.name}</span>
                                    <span style={{ float: "right", color: "green" }}>₹{p.price}</span>
                                    <h6>Description :{p.description}</h6>

                                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    {/* <button className="btn btn-secondary ms-1" onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, p])); toast.success("iteam added to cart");
                                    }} >Add to cart </button> */}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No similar products found.</p>
                )}
            </div>
        </Layout>
    );
};

export default ProductDetails
