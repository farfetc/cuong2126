import { Carousel } from 'antd';
import React from 'react';
import './index.scss';

// Do cả chương trình chỉ có 1 list carousel
// Nên lưu thẳng vào đây để đỡ tốn chi phí query
const list = [
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489860/Advertisement/perfume_ogyh6b.jpg',
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489861/Advertisement/2_qgx9bj.jpg',
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489860/Advertisement/3_xlsmtr.jpg',
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489861/Advertisement/6_xv5rgc.jpg',
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489860/Advertisement/5_g9xczy.jpg',
  'https://res.cloudinary.com/dk4pzxlqt/image/upload/v1669489860/Advertisement/4_rd6xvu.jpg',
];

function SaleOff() {
  return (
    <Carousel className="Sale-Off" autoplay>
      {list.map((item, index) => (
        <img className="Sale-Off-img" src={item} key={index} />
      ))}
    </Carousel>
  );
}

export default SaleOff;
