import { Carousel } from 'antd';
import React from 'react';
import './index.scss';

// Do cả chương trình chỉ có 1 list carousel
// Nên lưu thẳng vào đây để đỡ tốn chi phí query
const list = [

];

function ProductCarousel() {
  return (
    <Carousel className="Product-Carousel m-tb-24 bor-rad-8" autoplay>
      {list.map((item, index) => (
        <img
          className="Product-Carousel-img bor-rad-8"
          src={item}
          key={index}
        />
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
