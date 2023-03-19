import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Upload,
} from 'antd';
import adminApi from 'apis/adminApi';
import Compressor from 'compressorjs';
import constants from 'constants/index';
import React, { useRef, useState } from 'react';
import '../index.scss';
import ProductDetail from './ProductDetailModal';
const suffixColor = '#aaa';

function AddProduct() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [typeSelected, setTypeSelected] = useState(-1);
  const productDecs = useRef(null);
  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);
  // danh sách hình ảnh sp chưa nén
  const [fileList, setFileList] = useState([]);
  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef([]);

  // fn: xử lý khi chọn loại sản phẩm
  const onProductTypeChange = (value) => {
    if (!isTypeSelected) setIsTypeSelected(true);
    setTypeSelected(value);
  };


  // fn: nén ảnh sản phẩm, type: 0 - avt, type: 1 - picture List
  const onCompressFile = async (file, type = 0) => {
    new Compressor(file, {
      quality: constants.COMPRESSION_RADIO,
      convertSize: constants.COMPRESSION_RADIO_PNG,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          if (type === 0) setAvatar(reader.result);
          else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            });
        };
      },
      error(err) {
        message.error('Lỗi: ', err);
      },
    });
  };

  // fn: lấy bài viết mô tả sp
  const onGetDetailDesc = (data) => {
    productDecs.current = data;
  };

  // fn: Reset form
  const onResetForm = () => {
    form.resetFields();
    fileCompressedList.current = [];
    setAvtFileList([]);
    setAvatar(null);
    setFileList([]);
  };

  // fn: kiểm tra hình ảnh, bài viết trước submit form
  const onValBeforeSubmit = async (data) => {
    try {
      if (!avatar) {
        message.error('Thêm avatar !', 2);
        return;
      }
      // cảnh báo khi không có bài viết mô tả
      if (productDecs.current === null)
        Modal.confirm({
          title: 'Bạn có chắc muốn submit ?',
          content: 'Chưa có BÀI VIẾT MÔ TẢ cho sản phẩm này !',
          icon: <ExclamationCircleOutlined />,
          okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      else if (fileCompressedList.current.length === 0)
        Modal.confirm({
          title: 'Bạn có chắc muốn submit ?',
          content: 'Chưa có HÌNH ẢNH MÔ TẢ cho sản phẩm này !',
          icon: <ExclamationCircleOutlined />,
          okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      else onSubmit(data);
    } catch (error) {
      message.error('Có lỗi. Thử lại !');
    }
  };

  // fn: Xử lý submit form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const {
        code,
        name,
        price,
        discount,
        stock,
        brand,
        otherInfo,
        ...rest
      } = data;
      // các thuộc tính chung của sản phẩm
      const product = {
        type: typeSelected,
        discount,
        code,
        name,
        price,
        brand,
        stock,
        otherInfo,
        avatar,
      };
      // thuộc tính chi tiết của từng loại sp


      // data được gửi đi
      const dataSend = { product,  desc: productDecs.current };
      const response = await adminApi.postAddProduct(dataSend);
      if (response.status === 200) {
        setIsSubmitting(false);
        message.success('Thêm sản phẩm thành công');
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Thêm sản phẩm thất bại. Thử lại');
      }
    }
  };

  // returning...
  return (
    <div className="Admin-Product-Page">
      <h1 className="t-center p-t-20">
        <b>Thêm sản phẩm</b>
      </h1>
      {/* chọn loại sản phẩm */}
      {/* <Select
        className="m-l-20"
        size="large"
        style={{ width: 250 }}
        onChange={onProductTypeChange}
        placeholder="Chọn loại sản phẩm *">
        {constants.PRODUCT_TYPES.map((item, index) => (
          <Select.Option value={item.type} key={index}>
            {item.label}
          </Select.Option>
        ))}
      </Select> */}
      {/* form thông tin sản phẩm */}

        <div className="p-20">
          <Form
            name="form"
            form={form}
            onFinish={onValBeforeSubmit}
            onFinishFailed={() => message.error('Lỗi. Kiểm tra lại form')}>
            {/* các thông số cơ bản */}
            <Row gutter={[16, 16]}>
              {/* // Note: tổng quan một sản phẩm */}
              <Col span={24}>
                <h2>Thông tin cơ bản sản phẩm</h2>
              </Col>
              {/* mã sản phẩm */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: 'Bắt buộc', whitespace: true },
                  ]}>
                  <Input
                    size="large"
                    placeholder="Mã sản phẩm *"
                    suffix={
                      <Tooltip title="S19110000">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              {/* tên sản phẩm */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: 'Bắt buộc', whitespace: true },
                  ]}>
                  <Input
                    size="large"
                    placeholder="Tên sản phẩm *"
                    suffix={
                      <Tooltip title="Sữa rửa mặt Nivia">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="type"
                  >
                  <Select
                    size="large"
                    style={{ width: 325 }}
                    onChange={onProductTypeChange}
                    placeholder="Chọn loại sản phẩm *">
                    {constants.PRODUCT_TYPES.map((item, index) => (
                      <Select.Option value={item.type} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* giá sản phẩm */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: 'Bắt buộc' }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10000}
                    size="large"
                    placeholder="Giá *"
                    min={0}
                    max={1000000000}
                  />
                </Form.Item>
              </Col>
              {/* số hang tồn kho */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="stock"
                  rules={[{ required: true, message: 'Bắt buộc' }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    step={5}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Số lượng hàng tồn kho *"
                  />
                </Form.Item>
              </Col>
              {/* thương hiệu */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="brand"
                  rules={[
                    { required: true, message: 'Bắt buộc', whitespace: true },
                  ]}>
                  <Input
                    size="large"
                    placeholder="Thương hiệu *"
                    suffix={
                      <Tooltip title="Senka">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              {/*Thời gian bảo hành*/}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="warranty"
                  rules={[{ required: true, message: 'Bắt buộc' }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    step={6}
                    size="large"
                    min={0}
                    max={240}
                    placeholder="Hạn sử dụng (Theo tháng) *"
                  />
                </Form.Item>
              </Col>
              {/*Mức giảm giá*/}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="discount"
                  rules={[{ required: true, message: 'Bắt buộc' }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10}
                    size="large"
                    min={0}
                    max={30}
                    placeholder="Phần trăm khuyến mãi (5%) *"
                  />
                </Form.Item>
              </Col>
              {/* avatar */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Upload
                  listType="picture"
                  fileList={avtFileList}
                  onChange={({ fileList }) => {
                    if (avtFileList.length < 1) setAvtFileList(fileList);
                  }}
                  onRemove={() => {
                    setAvatar(null);
                    setAvtFileList([]);
                  }}
                  beforeUpload={(file) => {
                    onCompressFile(file, 0);
                    return false;
                  }}>
                  <Button
                    disabled={avatar !== null ? true : false}
                    className="w-100 h-100"
                    icon={<UploadOutlined />}>
                    Upload Avatar
                  </Button>
                </Upload>
              </Col>
              {/* other information */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.List name="otherInfo">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="center">
                          <Form.Item
                            {...field}
                            name={[field.name, 'key']}
                            fieldKey={[field.fieldKey, 'key']}
                            rules={[
                              {
                                required: true,
                                message: 'vd:Ưu đãi',
                              },
                            ]}>
                            <Input placeholder="Key" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'value']}
                            fieldKey={[field.fieldKey, 'value']}
                            rules={[
                              {
                                required: true,
                                message: 'vd: Combo chuột',
                              },
                            ]}>
                            <Input placeholder="Value" />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          size="large"
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}>
                          Thêm thông tin khác
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>

              {/* mô tả chi tiết */}
              <ProductDetail onGetDetailDes={onGetDetailDesc} />

              {/* // Note: chi tiết một sản phẩm */}
              {/* {isTypeSelected && (
                <Col span={24}>
                  <h2 className="m-b-10">
                    Thông tin chi tiết cho&nbsp;
                    <b>{constants.PRODUCT_TYPES[typeSelected].label}</b>
                  </h2>
                  {onRenderProduct(typeSelected)}
                </Col>
              )} */}

              {/* // Note: hình ảnh sản phẩm */}
              <Col span={24}>
                <h2 className="m-b-10">
                  Hình ảnh của sản phẩm (Tối đa 10 sản phẩm)
                </h2>

                <Upload
                  listType="picture-card"
                  multiple={true}
                  onRemove={(file) => {
                    fileCompressedList.current = fileCompressedList.current.filter(
                      (item) => item.uid !== file.uid,
                    );
                  }}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={(file) => {
                    onCompressFile(file, 1);
                    return false;
                  }}>
                  {fileList.length < 10 && '+ Thêm ảnh'}
                </Upload>
              </Col>

              {/* submit button */}
              <Col span={24} className="d-flex justify-content-end">
                <Button
                  className="m-r-20"
                  size="large"
                  danger
                  type="primary"
                  onClick={onResetForm}>
                  Reset Form
                </Button>
                <Button
                  loading={isSubmitting}
                  size="large"
                  type="primary"
                  htmlType="submit">
                  Thêm sản phẩm
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
    </div>
  );
}

export default AddProduct;
