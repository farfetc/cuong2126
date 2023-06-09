import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

function GlobalLoading(props) {
  return (
    <Spin
      size="large"
      className="Global-Loading trans-center"
      tip={props.content}
    />
  );
}

GlobalLoading.defaultProps = {
  content: 'Tutu Store Cosmetics Loading...',
};

GlobalLoading.propTypes = {
  content: PropTypes.string,
};

export default GlobalLoading;
