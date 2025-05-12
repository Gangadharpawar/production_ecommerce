import React from "react";
import { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import { } from "antd"
import Modal from "antd/es/modal/Modal";
const CreateCategory = () => {
  const [categories, SetCategories] = useState([])
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateName, setUpdateName] = useState("")
  //Hanel form 
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", { name });
      if (data.success) {
        toast.success(`${name} category is Created Successfully`);
        setName('');
        getAllcategory();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error)
      toast.error("somthing went wrong in Input form")
    }

  }
  //get all category
  const getAllcategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        SetCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllcategory();
  }, [])

  //update Category
  const handelUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updateName })
      if (data.success) {
        toast.success(`${updateName} category is Updated Successfully`);
        setSelected(null);
        setUpdateName("");
        setVisible(false);
        getAllcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("something went wrong in update category")
    }

  }

  //Delete  singel Category
  const handelDelete = async (pid) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${pid}`,)
      if (data.success) {
        toast.success(` Category Deleted Successfully `);
        getAllcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong in Delete Category");
    }

  }
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p3 w-50">
              <CategoryForm handelSubmit={handelSubmit} value={name} setValue={setName} />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (

                    <tr key={cat._id}>
                      <td>{cat.name}</td>
                      <td> <button className="btn btn-primary" onClick={() => { setVisible(true); setUpdateName(cat.name); setSelected(cat) }}>Edit </button></td>
                      <td> <button className="btn btn-danger" onClick={() => { handelDelete(cat._id) }}>Delete </button></td>
                    </tr >

                  ))}

                </tbody>
              </table>

            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
              <CategoryForm value={updateName} setValue={setUpdateName} handelSubmit={handelUpdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
