import React, { useEffect, useState } from 'react'
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [cart, setCart] = useCart();
    useEffect(() => {
        if (params?.slug) getProductByCategory();
    }, [params?.slug])
    const getProductByCategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <div className='container'>
                <h4 className='text-center'>{category?.name}</h4>
                <h6 className='text-center'>{products?.length} Result Found</h6>
                <div className="row">
                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <span className="card-title" style={{ fontWeight: "bold" }} >{p.name}</span>
                                    <span className="card-text" style={{ float: "right", color: "green" }}>₹{p.price}</span>
                                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    {/* <button className="btn btn-dark btn-sm ms-5" onClick={() => {
                                        setCart([...cart, p,]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, p])); toast.success("iteam added to cart");
                                    }} >Add to cart </button> */}
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
