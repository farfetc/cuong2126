const ProductModel = require('../models/product.models/product.model');
const { cloudinary } = require('../configs/cloudinary.config');
const ProductDescModel = require('../models/product.models/description.model');
const constants = require('../constants');
const helpers = require('../helpers');
const AdminModel = require('../models/account.models/admin.model');
const UserModel = require('../models/account.models/user.model');
const AccountModel = require('../models/account.models/account.model');
const OrderModel = require('../models/order.model');

// fn: upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, productCode) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile, {
      folder: `products/${productCode}`,
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};



// fn: upload product desc photo to cloudinary
const uploadDescProductPhoto = async (desc, productCode) => {
  try {
    let result = [];
    for (let item of desc) {
      const { content, photo } = item;
      const resUpload = await cloudinary.uploader.upload(photo, {
        folder: `products/${productCode}/desc`,
      });
      result.push({ content, photo: resUpload.secure_url });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// api: Thêm sản phẩm
const addProduct = async (req, res, next) => {
  try {

    const { product,  desc } = req.body;

    const { type, avatar, code, ...productRest } = product;

    // kiểm tra sản phẩm đã tồn tại hay chưa
    const isExist = await ProductModel.exists({ code });
    if (isExist) {
      return res.status(400).json({ message: 'Mã sản phẩm đã tồn tại !' });
    }

    // upload product avatar to cloudinary
    const avtUrl = await uploadProductAvt(avatar, code);

    // upload ảnh bài viết mô tả
    let productDesc = desc
      ? await uploadDescProductPhoto(desc.detailDesList, code)
      : null;
      console.log("Baotung");
    //Tạo sản phẩm mới
    const newProduct = await ProductModel.create({
      type,
      code,
      avt: avtUrl,
      ...productRest,
    });

    // Tạo sp thành công thì tạo chi tiết sản phẩm theo từng loại
    if (newProduct) {
      const { _id } = newProduct;
      // Tạo bài viết mô tả
      const newDesc = productDesc
        ? await ProductDescModel.create({
            idProduct: _id,
            title: desc.title,
            desc: productDesc,
          })
        : null;
        return res.status(200).json({ message: 'Thêm sản phẩm thành công' });
    }
  } catch (error) {
    return res.status(409).json({ message: 'Lỗi đường truyền, thử lại' });
  }
};

// api: Lấy danh sách sản phẩm theo loại và trang
const getProductListByType = async (req, res, next) => {
  try {
    const { type, page, perPage } = req.query;
    const nSkip = (parseInt(page) - 1) * perPage;
    const numOfProduct = await ProductModel.countDocuments({ type });
    const result = await ProductModel.find({ type })
      .skip(nSkip)
      .limit(parseInt(perPage));
    return res.status(200).json({ count: numOfProduct, data: result });
  } catch (error) {
    throw error;
  }
};

// api: Xoá một sản phẩm
const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    const response = await ProductModel.findById(id).select('type');
    if (response) {
      // xoá sản phẩm
      await ProductModel.deleteOne({ _id: id });
      // xoá bài mô tả sản phẩm
      await ProductDescModel.deleteOne({ idProduct: id });

    }
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(409).json({ message: 'Xoá sản phẩm thất bại' });
  }
};

// api: Cập nhật sản phẩm
const updateProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const { _id, ...rest } = product;
    const result = await ProductModel.updateOne(
      { _id: product._id },
      { ...rest },
    );
    if (result && result.ok === 1) {
      return res.status(200).json({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: 'failed' });
  }
};

// api: đăng nhập với admin
const postLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const adminUser = await AdminModel.findOne({ userName, password });
    if (adminUser) {
      return res.status(200).json({ name: adminUser.fullName });
    } else {
      return res.status(400).json({ message: 'failed' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'failed' });
  }
};

// api: lấy danh sách user admin
const getUserAdminList = async (req, res, next) => {
  try {
    const list = await AdminModel.find({}).select('-password');
    if (list) {
      return res.status(200).json({ list });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'failed' });
  }
};

// api: lấy danh sách người dùng
const getCustomerList = async (req, res, next) => {
  try {
    const list = await UserModel.find({}).populate({
      path: 'accountId',
      select: 'email authType -_id',
    });
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};

// api: xoá 1 người dùng
const delCustomer = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const customer = await UserModel.findById(userId);
    if (customer) {
      await AccountModel.deleteOne({ _id: customer.accountId });
      await UserModel.deleteOne({ _id: userId });
      return res.status(200).json({});
    }
  } catch (error) {
    return res.status(409).json({});
  }
};

// api: lấy danh sách đơn hàng
const getOrderList = async (req, res, next) => {
  try {
    const list = await OrderModel.find({}).select('-deliveryAdd -note');
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

// api: cập nhật trạng thái đơn hàng
const postUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id, orderStatus } = req.body;
    const response = await OrderModel.updateOne({ _id: id }, { orderStatus });
    if (response) return res.status(200).json({});
  } catch (error) {
    return res.status(401).json({});
  }
};

module.exports = {
  addProduct,
  getProductListByType,
  removeProduct,
  updateProduct,
  postLogin,
  getUserAdminList,
  getCustomerList,
  delCustomer,
  getOrderList,
  postUpdateOrderStatus,
};
