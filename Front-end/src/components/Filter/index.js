import constants from 'constants/index';
import React, { useState } from 'react';
import './index.scss';
import MenuFilter from './MenuFilter';

function Filter() {
  const [filterDetails, setFilterDetails] = useState({
    visible: false,
    list: [],
    root: '',
  });
  // event: hiển thị chi tiết filter menu
  const onShowDetails = (key) => {
    const list = constants.FILTER_OPTION_LIST.find((item) => item.key === key);
    if (list)
      setFilterDetails({ visible: true, list: list.data, root: list.root });
    else setFilterDetails({ visible: false, list: [], root: '' });
  };

  // event: tắt chi tiết filter menu
  const onCloseDetails = () => {
    setFilterDetails({ visible: false, list: [], root: '' });
  };

  // rendering ...
  return (
    <>
      <MenuFilter onShow={onShowDetails} />
    </>
  );
}

export default Filter;
