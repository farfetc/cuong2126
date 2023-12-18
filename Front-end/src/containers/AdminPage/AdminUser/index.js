import { Button, message, Table, Popconfirm } from 'antd';
import adminApi from 'apis/adminApi';
import React, { useEffect, useState } from 'react';

import ModalCreateEdit from './components/ModalCreateEdit';

import { useLogicAdminUser } from './hooks';

function AdminUser() {
  const {
    data,
    isVisible,
    activeItem,
    setIsVisible,
    setActiveItem,
    onDelCustomer,
    onCreateOrEdit,
  } = useLogicAdminUser({ data });

  const columns = [
    {
      title: 'User Name',
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: 'Họ tên',
      key: 'fullName',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Quê quán',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: 'Tuổi',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'Facebook',
      key: 'fb',
      dataIndex: 'fb',
      render: (fb) => (
        <a href={fb} target="blank">
          Link Facebook
        </a>
      ),
    },
    {
      title: '',
      render: (_v, records) => (
        <>
          <Button
            className="m-r-5"
            onClick={() => {
              setActiveItem({ ...records });
              setIsVisible(true);
            }}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá ?"
            placement="left"
            cancelText="Huỷ bỏ"
            okText="Xoá"
            onConfirm={() => onDelCustomer(records && records._id)}>
            <Button danger>Xoá</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="d-flex justify-content-end">
        <Button
          className="btn-create"
          onClick={() => {
            setIsVisible(true);
            setActiveItem({});
          }}>
          Tạo Mới +
        </Button>
      </div>
      <Table pagination={false} columns={columns} dataSource={data} />

      <ModalCreateEdit
        open={isVisible}
        activeItem={activeItem}
        handleClose={setIsVisible}
        onCreateOrEdit={onCreateOrEdit}
      />
    </React.Fragment>
  );
}

export default AdminUser;
