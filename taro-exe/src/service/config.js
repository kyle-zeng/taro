// const devURL = 'https://xcxpprdapi.pengjs.com'; // 开发环境，需要开启mock server（执行：gulp mock）
const devURL = 'https://xdxcx.pengjs.com'; // 开发环境，需要开启mock server（执行：gulp mock）
// const devURL = "http://10.1.1.45:10180"; // 开发环境
const prodURL = 'https://xdxcx.pengjs.com'; // 开发环境
// const prodURL = 'https://xcx.pengif.com'; // 生产环境，线上服务器

const BASE_URL = process.env.NODE_ENV === 'development' ? devURL : prodURL;

export default BASE_URL;
