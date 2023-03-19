import constants from 'constants/index';

// fn: chuyển đổi 1 số keyword sang mongo key, ex: "lonhon-" => "$gte:"
const replaceMongoKeyword = (value = '') => {
  let result = value;
  constants.PAIR_CONVERT_KEY.forEach((pair) => {
    result = result.replaceAll(pair.l, pair.r);
  });
  return result;
};

// fn: query string: ?t=0&key=1 => [{ t:0 }, { key: 1 }]
const queryString = (query = '') => {
  if (!query || query === '') return [];
  let result = [];
  let q = query;
  // xoá ký tự '?' nếu có
  if (q[0] === '?') q = q.slice(1, q.length);
  // tách các cụm query ['t=0', 'key=1']
  const queryList = q.split('&');
  result = queryList.map((str) => {
    let res = {};
    let temp = str.split('=');
    if (temp.length <= 1) res[temp[0]] = '';
    else res[temp[0]] = temp[1];
    return res;
  });

  return result;
};

// fn: phân tích query param url
// vd: key = p-reg-brand, value = Apple => {brand: {$regex: /^Apple$/i}}
// option p- là thuộc tính trong Product Model
const analysisQuery = (key = '', value = '') => {
  try {
    if (key === '') return;
    let result = {};

    // split '-' => ["p", "reg", "brand"]
    const options = key.split('-');

    // lấy main key là phần tử cuối trong mảng
    const mainKey = options[options.length - 1];

    // Note:nếu tồn tại "p" thì là thuộc tính của product model
    const isProductAttr = options.indexOf('p') === -1 ? false : true;

    // Note: nếu tồn tại "reg" tức là chuỗi cần bỏ vào regex
    const isRegex = options.indexOf('reg');

    // Note: nếu tồn tại "o" tức chuỗi là 1 object
    const isObject = options.indexOf('o');

    // value tồn tại ";" tức là đa giá trị
    const compositeValues = value.split(';');
    if (compositeValues.length <= 1) {
      // Note: đơn giá trị
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        const newObj = {};
        newObj[mainKey] = { $regex: `${value}` };
        Object.assign(result, newObj);
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        const newObj = JSON.parse(`{${value}}`);
        result[mainKey] = newObj;
      } else {
        // không chứa key đặc biệt
        result[mainKey] = `${value}`;
      }
    } else {
      // Note: nhiều giá trị [values]
      result['$or'] = [];
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = { $regex: `${valueItem}` };
          result['$or'].push(newObj);
        });
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = JSON.parse(`{${valueItem}}`);
          result['$or'].push(newObj);
        });
      } else {
        // không chứa key đặc biệt
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = `${valueItem}`;
          result['$or'].push(newObj);
        });
      }
    }

    // return
    return { isProductAttr, result };
  } catch (error) {
    // error
    return { isProductAttr: true, result: {} };
  }
};

// fn: định dạng chuỗi truy vấn
const formatQueryString = (str = '') => {
  let result = str;
  // xoá tất cả ký tự đặc biệt
  result = str.replace(/[`~!@#$%^&*()_|+\-=?;:<>\{\}\[\]\\\/]/gi, '');
  // thay khoảng trắng thành dấu cộng
  result = result.replace(/[\s]/gi, '+');
  return result;
};

// fn: hàm rút gọn tên sản phẩm
const reduceProductName = (name, length = 64) => {
  let result = name;
  if (name && name.length >= length) {
    result = name.slice(0, length) + ' ...';
  }
  return result;
};

// fn: hàm format giá sản phẩm
const formatProductPrice = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// fn: tính tỉ lệ sao của sản phẩm [1,2,3,4,5]
const calStar = (rates) => {
  const total = rates.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let rateTotal = 0;
  for (let i = 0; i < 5; ++i) {
    rateTotal += rates[i] * (i + 1);
  }
  return rateTotal / total;
};

// fn: chuyển key product thành tiếng Việt, vd: color => màu sắc
const convertProductKey = (key) => {
  switch (key) {
    case 'brand':
      return 'Thương hiệu';
    case 'warranty':
      return 'Hạn sử dụng';
    default:
      return 'Chi tiết khác';
  }
};


// fn: chuyên width màn hình window -> size theo ant design
const convertWidthScreen = (size = 576) => {
  if (size < 576) return 'xs';
  if (size >= 576 && size < 768) return 'sm';
  if (size >= 768 && size < 992) return 'md';
  if (size >= 992 && size < 1200) return 'lg';
  if (size >= 1200 && size < 1600) return 'xl';
  return 'xxl';
};

// fn: Hàm chuyển rate thành text
const convertRateToText = (rate = 0) => {
  switch (rate) {
    case 0:
      return 'Sản phẩm quá tệ';
    case 1:
      return 'Sản phẩm không tốt';
    case 2:
      return 'Sản phẩm bình thường';
    case 3:
      return 'Sản phẩm tốt';
    case 4:
      return 'Cực kỳ hài lòng';
    default:
      return 'Sản phẩm bình thường';
  }
};

// fn: format thời gian
const formatDate = (date = new Date().getTime()) => {
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate();

  return `${day} tháng ${m + 1}, ${y}`;
};

//fn: chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
  switch (type) {
    case 0:
      return 'Chăm sóc da mặt';
    case 1:
      return 'Chăm sóc cơ thể';
    case 2:
      return 'Chăm sóc tóc';
    case 3:
      return 'Trang điểm';
    case 4:
      return 'Nước Hoa';
    case 5:
      return 'Dụng cụ làm đẹp';
    default:
      return 'Khác';
  }
};


// fn: random màu
const randomColor = () => {
  let r = Math.round(Math.random() * 254 + 1);
  let g = Math.round(Math.random() * 254 + 1);
  let b = Math.round(Math.random() * 254 + 1);
  return `rgb(${r},${g},${b})`;
};

// fn: generate autocomplete search options
const autoSearchOptions = () => {
  let result = [];
  // laptop
  result.push({ value: 'Chăm sóc da mặt' });
  result.push({ value: 'Chăm sóc cơ thể' });
  result.push({ value: 'Chăm sóc tóc' });
  result.push({ value: 'Nước Hoa' });
  result.push({ value: 'Dụng cụ làm đẹp' });

  return result;
};




// fn: chuyển đổi thời gian now -> dd/mm/yyyy
const formatOrderDate = (date = Date.now(), flag = 0) => {
  const newDate = new Date(date);
  const d = newDate.getDate(),
    m = newDate.getMonth() + 1,
    y = newDate.getFullYear();
  return flag === 0
    ? `${d}/${m}/${y}`
    : `${newDate.getHours()}:${newDate.getMinutes()} ${d}/${m}/${y}`;
};

// fn: chuyển đổi tình trạng đơn hàng
const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 0:
      return 'Đặt hàng thành công';
    case 1:
      return 'Đã xác nhận';
    case 2:
      return 'Đang giao hàng';
    case 3:
      return 'Giao hàng thành công';
    default:
      return 'Đặt hàng thành công';
  }
};

// fn: chuyển đổi phương thức thanh toán
const convertPaymentMethod = (payMethod = 0) => {
  switch (payMethod) {
    case 0:
      return 'Thanh toán tiền mặt khi nhận hàng';
    case 1:
      return 'Thanh toán online';
    default:
      return 'Thanh toán tiền mặt khi nhận hàng';
  }
};

// fn: tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  const { transportFee, orderProd, numOfProd } = order;
  const total =
    transportFee +
    (orderProd.price * numOfProd -
      (orderProd.price * numOfProd * orderProd.discount) / 100);
  return total;
};

export default {
  replaceMongoKeyword,
  formatQueryString,
  queryString,
  analysisQuery,
  reduceProductName,
  formatProductPrice,
  calStar,
  convertProductKey,
  convertWidthScreen,
  convertRateToText,
  convertProductType,
  formatDate,
  randomColor,
  autoSearchOptions,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  calTotalOrderFee,
};
