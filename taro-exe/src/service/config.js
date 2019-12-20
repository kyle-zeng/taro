const devURL = 'https://xdxcx.xxxx.com'; // 开发环境，需要开启mock server（执行：gulp mock）
const prodURL = 'https://xdxcx.xxxx.com'; // 开发环境

const BASE_URL = process.env.NODE_ENV === 'development' ? devURL : prodURL;

export default BASE_URL;
