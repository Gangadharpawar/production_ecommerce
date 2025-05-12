import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';
const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();

    const [clientToken, setClientToken] = useState();
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    //Total Price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => { total = total + item.price; })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
            })
        } catch (error) {
            console.log(error)
        }
    }
    //Delete item from card

    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid)
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }
    //get Payment geteway  token

    const getToken = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/braintree/token')
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getToken()
    }, [auth?.token]);

    //handle Payment
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("/api/v1/product//braintree/payment", {
                nonce, cart
            })
            setLoading(false);
            localStorage.removeItem('cart')
            setCart([])
            navigate('/dashboard/user/orders')
            toast.success("Payment Completed Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Payment error. Please try again.");
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-center  p-2 mb-1">
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h3>
                        <h6 className='text-center'>
                            {cart?.length ? `You Have  ${cart.length} items in your cart
                            ${auth?.token ? " " : "please Login  to Checkout"}` : "Your cart is Empty"}
                        </h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        {
                            cart?.map((p) => (
                                <div className="row mb-2 card flex-row" key={p._id}>
                                    <div className="col-md-2">
                                        <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top img-fluid" alt={p.name} />
                                    </div>
                                    <div className="col-md-8">
                                        <span style={{ fontWeight: "bold" }}>Name :-{p.name}</span>
                                        <span style={{ float: "right", color: "green" }}>₹ {p.price} </span>
                                        {/* <p>{p.description.substring(0, 50)} </p> */}
                                        <p>Description:-{p.description}</p>
                                        <button className='btn btn-outline-danger btn-sm' onClick={() => removeCartItem(p._id)}>Remove</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="col-md-3 text-center">
                        <h4>Cart Summary</h4>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total :{totalPrice()}</h4>
                        {auth?.user?.address ? (

                            <div className="mb-3">
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button className='btn btn-outline-warning btn-sm' onClick={() => navigate('/dashboard/user/profile')}>
                                    Update Address</button>
                            </div>

                        ) : (

                            <div className="mb-3">
                                {
                                    auth?.token ? (<button className='btn btn-outline-warning btn-sm' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>)
                                        : (<button className='btn btn-outline-warning btn-sm' onClick={() => navigate('/login')}>Please Login to Checkout</button>)
                                }
                            </div>


                        )}
                        <div className="mt-2">
                            {!clientToken || !cart?.length ? (" ") : (
                                <>
                                    <DropIn options={{
                                        authorization: clientToken,
                                        paypal: {
                                            flow: 'vault'
                                        },
                                    }}
                                        onInstance={(instance) => setInstance(instance)} />
                                    <button className='btn btn-primary' onClick={handlePayment}
                                        disabled={!instance || !auth?.user?.address} >
                                        {loading ? "Processing..." : "Make Payment"}</button>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div >
        </Layout >
    )
}

export default CartPage
