import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment"
import toast from "react-hot-toast";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/orders')
      setOrders(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders()
  }, [auth?.token])


  const handleCancel = async (orderId) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-Cancel/${orderId}`);
      toast.success("Order cancelled successfully");
      await getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  }
  const handleDelete = async (orderId) => {
    try {
      const { data } = await axios.delete(`/api/v1/auth/order-delete/${orderId}`);
      // if (!orders.status.cancelled) {
      //   toast.success("Only cancelled orders can be deleted")
      // }
      toast.success("Order Deleted successfully");
      await getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
    }
  }
  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {/* <p>{JSON.stringify(orders, null, 4)}</p> */}
            {
              orders.map((o, i) => {
                return (
                  <div className="border shadow" key={i._id}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">S NO</th>
                          <th scope="col">Status</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer.name}</td>
                          <td>{moment(o?.createAt).fromNow()}</td>
                          <td>{o?.payment.success ? "Success" : "Failed"}</td>
                          <td>{o?.products?.length}</td>
                          <button className='btn btn-secondary btn-sm ms-1' onClick={() => handleCancel(o._id)}>Cancel Order</button>
                          <button className='btn btn-danger btn-sm ms-1' onClick={() => handleDelete(o._id)}>Delete Order</button>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {
                        o.products?.map((p) => (
                          <div className="row mb-2 card flex-row" key={p._id}>
                            <div className="col-md-2">
                              <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top img-fluid" alt={p.name} />
                            </div>
                            <div className="col-md-8">
                              <p>Item Name:{p.name} </p>
                              <p>Item Details:{p.description.substring(0, 50)} </p>
                              <p>Price: ₹{p.price} </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
