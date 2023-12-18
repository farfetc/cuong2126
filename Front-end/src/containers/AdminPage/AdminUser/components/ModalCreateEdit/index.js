/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';

import PropTypes from 'prop-types';

function ModalCreateEdit({ open, activeItem, handleClose, onCreateOrEdit }) {
  const { _id, address, age, email, fb, fullName, phone, userName } =
    activeItem || {};
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current && !open) formRef.current.resetFields();
  }, [open]);

  useEffect(() => {
    if (formRef.current && _id) {
      formRef.current.setFieldValue('fb', fb);
      formRef.current.setFieldValue('id', _id);
      formRef.current.setFieldValue('age', Number(age));
      formRef.current.setFieldValue('email', email);
      formRef.current.setFieldValue('phone', phone);
      formRef.current.setFieldValue('address', address);
      formRef.current.setFieldValue('fullName', fullName);
      formRef.current.setFieldValue('userName', userName);
    }
  }, [activeItem]);

  return (
    <Modal
      destroyOnClose={false}
      visible={open}
      width={1000}
      centered
      title={_id ? 'Chỉnh sửa' : 'Tạo mới '}
      onCancel={() => handleClose(false)}
      footer={[
        <Button key="back" onClick={() => handleClose(false)}>
          Quay lại
        </Button>,
        <Button key="submit" htmlType="submit" form="detailForm" type="primary">
          Submit
        </Button>,
      ]}>
      <Form name="detailForm" onFinish={onCreateOrEdit} ref={formRef}>
        <Row gutter={[16, 0]}>
          {/* Tiêu đề, tên sp */}
          <Col span={12} className="p-b-8">
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Tên đăng nhập *" />
            </Form.Item>
          </Col>

          {!_id && (
            <Col span={12} className="p-b-8">
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Bắt buộc', whitespace: true },
                ]}>
                <Input size="large" placeholder="Mật khẩu *" type="password" />
              </Form.Item>
            </Col>
          )}

          <Col span={12} className="p-b-8">
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Họ tên *" />
            </Form.Item>
          </Col>
          <Col span={12} className="p-b-8">
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Số điện thoại *" />
            </Form.Item>
          </Col>
          <Col span={12} className="p-b-8">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Email *" type="email" />
            </Form.Item>
          </Col>
          <Col span={12} className="p-b-8">
            <Form.Item
              name="age"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Tuổi *" />
            </Form.Item>
          </Col>
          <Col span={12} className="p-b-8">
            <Form.Item
              name="address"
              rules={[
                { required: true, message: 'Bắt buộc', whitespace: true },
              ]}>
              <Input size="large" placeholder="Quê quán *" />
            </Form.Item>
          </Col>
          <Col span={12} className="p-b-8">
            <Form.Item name="fb">
              <Input size="large" placeholder="địa chỉ facebook" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

// ! Check prop type
ModalCreateEdit.propTypes = {
  onGetDetailDes: PropTypes.func,
};

export default ModalCreateEdit;
