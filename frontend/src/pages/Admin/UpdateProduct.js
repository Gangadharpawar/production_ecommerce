import React, { useState, useEffect, use } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from 'antd'
import { useNavigate, useParams } from "react-router-dom";
const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [photo, setPhoto] = useState(null);
    const [id, setId] = useState('');
    const { Option } = Select

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
    }, []);

    //get Single  category

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`)
            if (data.success) {
                setId(data.product._id)
                setName(data.product.name)
                setDescription(data.product.description)
                setPrice(data.product.price)
                setQuantity(data.product.quantity)
                setShipping(data.product.shipping)
                setCategory(data.product.category._id);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getSingleProduct();
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const proudctData = new FormData()
            proudctData.append("name", name)
            proudctData.append("description", description)
            proudctData.append("price", price)
            proudctData.append("quantity", quantity)
            proudctData.append("shipping", shipping)
            photo && proudctData.append("photo", photo)
            proudctData.append("category", category)
            const { data } = await axios.put(`/api/v1/product/update-product/${id}`, proudctData)
            if (data?.success) {
                toast.success("Product Updated Successfully")
                navigate("/dashboard/admin/products")
            } else {
                toast.error(data?.message)

            }
        } catch (error) {
            console.log(error);
            toast.error('somthing went wrong');

        }
    }
    const handleDelete = async () => {
        try {
            let answer = window.confirm('Are you sure want to delete this Product ');
            if (!answer) return
            const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`)
            if (data?.success) {
                toast.success("Product Deleted Successfully");
                navigate("/dashboard/admin/products")
            } else {
                toast.error(data?.message || "Failed to delete product");
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while deleting the product");

        }

    }
    return (
        <Layout title={"Dashboard -Create Proudct"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-6">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false} placeholder='Select a category' size="large" showSearch className="form-select mb-3" onChange={(value) => { setCategory(value) }}
                                value={category}>
                                {categories?.map(cat => (
                                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                ))}

                            </Select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : 'Upload Photo'}
                                    <input type="file" name="photo" accept="images/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (<div className="text-center">
                                    <img src={URL.createObjectURL(photo)} alt="Proudct_photo" height={'200px'} className="img img-responsiv" />
                                </div>) :
                                    <div className="text-center">
                                        <img src={`/api/v1/product/product-photo/${id}`} alt="Proudct_photo" height={'200px'} className="img img-responsiv" />
                                    </div>}
                            </div>
                            <div className="mb-3">
                                <input type="text" value={name} placeholder=" Write  a Name" className="form-control" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea type="text" value={description} placeholder=" Write  a description" className="form-control" onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="number" value={price} placeholder=" Write  a price" className="form-control" onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="number" value={quantity} placeholder=" Write  a quantity" className="form-control" onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <Select bordered={false} placeholder=" Select shipping" size="large" showSearch className="form-select mb-3" onChange={(value) => setShipping(value)}
                                    value={shipping ? 'YES' : 'NO'}>
                                    <Option value="0">NO</Option>
                                    <Option value="1">YES</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>UPDATE PRODUCT</button>
                                <button className="btn btn-danger" style={{ float: "right" }} onClick={handleDelete}>DELETE PRODUCT</button>
                            </div>
                            <div className="mb-3">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct
