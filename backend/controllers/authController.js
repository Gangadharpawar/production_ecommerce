import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePasswrod, hashpassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, phone, address, password, answer } = req.body;
    //validation

    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      res.send({ message: "Email  is Required" });
    }

    if (!phone) {
      res.send({ message: "Phone  no is Required" });
    }
    if (!address) {
      res.send({ message: "Address is Required" });
    }
    if (!password) {
      res.send({ message: "Password is Required" });
    }
    if (!answer) {
      res.send({ message: "Password is Required" });
    }
    //check user
    const existinguser = await userModel.findOne({ email });
    //existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please login",
        existinguser,
      });
    }
    //register user
    const hashedpassword = await hashpassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedpassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error to Registration",
      error,
    });
  }
};

// POST Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not Registerd",
      });
    }
    const match = await comparePasswrod(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login ",
      error,
    });
  }
};

//forgot password Controller
export const ForgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is Required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is Required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or Answer",
      });
    }
    const hashed = await hashpassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//test Conteroller

export const testConteroller = async (req, res, next) => {
  console.log("Protected Route");
  try {
  } catch (error) {
    console.log(error);
  }
};

//update user Profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body
    const user = await userModel.findById(req.user._id)
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Password is Required and 6 character Long" })
    }
    const hashedpassword = password ? await hashpassword(password) : undefined
    const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      password: hashedpassword || user.password,
      address: address || user.address,
      phone: phone || user.phone
    }, { new: true })
    res.status(200).send({
      success: true,
      message: "Profile Update Successfully",
      updateUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while update User Profile",
      error
    })
  }
}

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Getting Order',
      error
    })
  }
}



//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Getting Order',
      error
    })
  }
}

//order status controller

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating  Order",
      error
    })
  }
}

//order cancell from user side

export const orderCancel = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" }, { new: true })
    if (order) {
      res.status(200).send({
        success: true,
        message: "Order cancelled successfully",
        data: order
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while cancelling order",
      error
    })
  }
}

//cancel order delete from user side 
export const orderDelete = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderModel.findByIdAndDelete(orderId)
    // if (!order.status.cancelled) {
    //   res.status(500).send({
    //     success: false,
    //     message: "Only cancelled orders can be deleted",
    //   })
    // }
    res.status(200).send({
      success: true,
      message: "Cancelled order deleted successfully",
    });

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while deleting order",
      error
    })
  }
}