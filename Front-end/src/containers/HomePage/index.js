import { BackTop, Col, Row } from 'antd';
import Filter from 'components/Filter';
import RelatedProduct from 'containers/ProductDetailPage/RelatedProduct';
import React from 'react';
import AllProduct from './AllProduct';
import DiscountList from './DiscountList';
import './index.scss';
import SaleOff from './SaleOff';

function HomePage() {
  // kéo về đầu trang
  document.querySelector('body').scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });

  return (
    <div className="Home">
      {/* Carousel cho sale off */}
      <div className="pos-relative">
        <SaleOff />
        <div className="filter-wrapper trans-center container w-100 h-80">
          <Col span={6}>
            <Filter />
          </Col>
        </div>
      </div>

      <Row className="container">
        {/* Danh sách sản phẩm khuyến mãi */}
        <Col className="m-tb-32" span={24}>
          <DiscountList />
        </Col>

        {/* Sản phẩm bán chạy */}
        <Col span={24} className="m-b-32 hot-products box-sha-home bor-rad-8">
          <RelatedProduct title="Sản phẩm bán chạy" type={0} />
        </Col>

        {/* Tổng hợp sản phẩm */}
        <Col span={24} className="m-b-32 bg-white box-sha-home bor-rad-8">
          <AllProduct />
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
