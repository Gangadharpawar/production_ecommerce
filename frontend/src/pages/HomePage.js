import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from 'antd';
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  //get all category
  const getAllcategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllcategory();
    getTotal();
  }, [])
  //get All Products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      // const { data } = await axios.get(`/api/v1/product/get-product`);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }
  //get Total Count

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count")
      setTotal(data?.total)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (page === 1) return
    loadMore();
  }, [page])
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products])
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  //filter by category
  const handlefilter = (value, id) => {
    let all = [...checked]
    if (value) {
      all.push(id)
    } else {
      all = all.filter(c => c !== id)
    }
    setChecked(all);
  }
  useEffect(() => {
    if (!checked.length || !checked.radio) getAllProducts();
  }, [checked.length, checked.radio])

  useEffect(() => {
    if (checked.length || checked.radio) filterProduct();
  }, [checked, radio])
  // get Filter Products

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`/api/v1/product/product-filters`, { checked, radio })
      setProducts(data?.products)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <Layout title={"All Products -Best offers"}>
      {/* <h1>Home Page</h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div>
        <img src="/images/banner6.jpg" className="img-fluid w-100" alt="Banner Image" />
      </div>
      <div className="row">
        <div className="col-md-2 mt-5">

          <h4>Filter By Category</h4>
          <div className="d-flex flex-column">
            {
              categories.map((c) => (
                <Checkbox key={c._id} onChange={(e) => handlefilter(e.target.checked, c._id)}>
                  {c.name}
                </Checkbox>
              ))
            }
          </div>
          <h4>Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={e => setRadio(e.target.value)}>
              {Prices?.map(p => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button className="btn btn-dark btn-sm" onClick={() => window.location.reload()}>RESET FILTER</button>
          </div>
        </div>
        <div className="col-md-10">
          {/* {JSON.stringify(radio, null, 4)}
          {JSON.stringify(checked, null, 4)} */}
          <h1 className="text-center">All Products-{total}</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2 " style={{ width: '18rem' }} key={p._id}>
                < img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top img-fluid" alt={p.name} max-width={"100 %"} height={"auto"} />
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
          <div className="m-2 p-3">{products && products.length < total && (
            <button className="btn btn-warning" onClick={(e) => { e.preventDefault(); setPage(page + 1) }}>
              {loading ? "loading..." : "LoadMore"}
            </button>
          )}</div>
        </div>
      </div>
    </Layout >
  );
};

export default HomePage;
