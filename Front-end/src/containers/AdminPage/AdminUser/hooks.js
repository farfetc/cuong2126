import { useState, useEffect } from 'react';
import { message } from 'antd';

import adminApi from 'apis/adminApi';

export function useLogicAdminUser() {
  const [data, setData] = useState([]);
  const [activeItem, setActiveItem] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // event: Lấy danh sách admin user
  useEffect(() => {
    getUserAdminList();
  }, []);

  const getUserAdminList = async () => {
    try {
      const response = await adminApi.getUserAdminList();
      if (response) {
        const list = response.data.list;
        const listWittKey = list.map((item, index) => {
          return { ...item, key: index };
        });
        setData(listWittKey);
      }
    } catch (error) {}
  };

  const onDelCustomer = async (id) => {
    try {
      const response = await adminApi.delUserAdmin(id);
      if (response && response.status === 200) {
        message.success('Xoá tài khoản thành công');
        getUserAdminList();
      }
    } catch (error) {
      message.error('Xoá tài khoản thất bại');
    } finally {
      setIsVisible(false);
    }
  };

  const onCreateOrEdit = async (payload) => {
    try {
      if (activeItem && activeItem._id) {
        const response = await adminApi.putUserAdmin({
          id: activeItem._id,
          userAdmin: {
            ...activeItem,
            ...payload,
          },
        });
        if (response && response.status === 200) {
          message.success('Chỉnh sửa tài khoản thành công');
          getUserAdminList();
        }
        return;
      }

      const response = await adminApi.postUserAdmin(payload);
      if (response && response.status === 200) {
        message.success('Tạo tài khoản thành công');
        getUserAdminList();
      }
    } catch (error) {
      const { message } = (error.response && error.response.data) || {};
      message.error(message);
    } finally {
      setIsVisible(false);
    }
  };

  return {
    data,
    isVisible,
    activeItem,
    setIsVisible,
    setActiveItem,
    onDelCustomer,
    onCreateOrEdit,
  };
}
