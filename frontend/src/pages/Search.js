import React from 'react'
import Layout from './../components/Layout/Layout';
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
const Search = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [values, setValues] = useSearch();
    return (
        <Layout title={"Search  Result"}>
            <div className='container'>
                <div className='text-center'>
                    <h1>Search  Results</h1>
                    <h6>{values?.results.length < 1 ? 'No products found' : `Found ${values?.results.length}`}</h6>
                    <div className="d-flex flex-wrap mt-4">
                        {values?.results.map((p) => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top img-fluid" alt={p.name} max-width={"100 %"} height={"auto"} />
                                <div className="card-body">
                                    <span className="card-title " style={{ fontWeight: "bold" }} >{p.name}</span>  <span className="card-text" style={{ float: "right", color: "green" }}>₹ {p.price}</span>
                                    {/* <p className="card-text">{p.description.substring(0, 30)}...</p> */}

                                    {p.description && (
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    )}
                                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className="btn btn-dark btn-sm ms-5 " onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, p])); toast.success("iteam added to cart");
                                    }} >Add to cart </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Search
