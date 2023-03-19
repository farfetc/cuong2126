// gender options
const GENDER_OPTIONS = [
  { value: true, label: 'Nam' },
  { value: false, label: 'Nữ' },
];

// hình thức giao hàng
const TRANSPORT_METHOD_OPTIONS = [
  { value: 0, label: 'Giao hàng tiêu chuẩn', price: 40000 },
  { value: 1, label: 'Giao hàng tiết kiệm', price: 20000 },
  { value: 2, label: 'Giao hàng nhanh', price: 100000 },
];

// product type options
const PRODUCT_TYPES = [
  { type: 0, label: 'Chăm sóc da mặt' },
  { type: 1, label: 'Chăm sóc cơ thể' },
  { type: 2, label: 'Chăm sóc tóc' },
  { type: 3, label: 'Trang điểm' },
  { type: 4, label: 'Nước Hoa' },
  { type: 5, label: 'Dụng cụ làm đẹp' },
];

const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/login/forgot-pw',
  PRODUCT: '/product/:productId',
  NOT_FOUND: '/not-found',
  ADMIN: '/admin',
  ACCOUNT: '/account',
  CART: '/cart',
  SEARCH: '/search',
  FILTER: '/filter',
  ACCOUNT: '/account',
  PAYMENT: '/payment',
};

// FILTERS


// filter options list
const FILTER_OPTION_LIST = [

];

// các cặp chuyển đổi url
const PAIR_CONVERT_KEY = [

];

export default {
  REFRESH_TOKEN_KEY: 'refresh_token',
  ACCESS_TOKEN_KEY: 'tutu_atk',
  MAX_VERIFY_CODE: 6,
  TRANSPORT_METHOD_OPTIONS,
  GENDER_OPTIONS,
  // tuổi nhỏ nhất sử dụng app
  MIN_AGE: 8,
  // thời gian delay khi chuyển trang
  DELAY_TIME: 750,
  // số lần đăng nhập sai tối đa
  MAX_FAILED_LOGIN_TIMES: 5,
  ROUTES,
  REFRESH_TOKEN: 'refresh_token',
  PRODUCT_TYPES,
  // tỉ lệ nén ảnh, và nén png 2MB
  COMPRESSION_RADIO: 0.6,
  COMPRESSION_RADIO_PNG: 2000000,
  // số lượng sản phẩm liên quan tối đa cần lấy
  MAX_RELATED_PRODUCTS: 12,
  // Avatar mặc định của user
  DEFAULT_USER_AVT:
    'https://res.cloudinary.com/tuan-cloudinary/image/upload/c_scale,q_60,w_80/v1607750466/defaults/default-avatar_amkff5.jpg',
  // Số comment sản phẩm trên trang
  COMMENT_PER_PAGE: 5,
  // độ dài tối đa của cmt
  MAX_LEN_COMMENT: 1000,
  // key danh sách giỏ hàng
  CARTS: 'carts',
  FILTER_OPTION_LIST,
  PAIR_CONVERT_KEY,
};
