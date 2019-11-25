import Taro from '@tarojs/taro';
import BASE_URL from './config';
import interceptors from './interceptors';

interceptors.forEach(i => Taro.addInterceptor(i));

function parseParams(data) {
  try {
      var tempArr = [];
      for (var i in data) {
          var key = encodeURIComponent(i);
          var value = encodeURIComponent(data[i]);
          tempArr.push(key + '=' + value);
      }
      var urlParamsStr = tempArr.join('&');
      return urlParamsStr;
  } catch (err) {
      return '';
  }
}

export default {
  baseOptions(params, method = 'GET') {
    let { url, data, showToast } = params;
    let contentType = 'application/json';
    contentType = params.contentType || contentType;
    const option = {
      url: url.indexOf('http') !== -1 ? url : BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        'x-api-key': decodeURIComponent(Taro.getStorageSync('Authorization'))
      },
      showToast: showToast,
    };
    return Taro.request(option);
  },
  fileOptions(params) {
    let { url, data, showToast } = params;
    return Taro.uploadFile({
      url: url.indexOf('http') !== -1 ? url : BASE_URL + url,
      header: {
        // 'content-type': 'multipart/form-data',
        'x-api-key': Taro.getStorageSync('Authorization'),
      },
      name: 'file',
      filePath: data.filePath,
      formData: data.formData,
      showToast: showToast,
    });
  },
  filedownOptions(params) {
    let { url, data, showToast } = params; 
    let param = parseParams(data)
    console.log("fileDownloanParam:--------"+param);
    return Taro.downloadFile({
      // url: url.indexOf('http') !== -1 ? url : BASE_URL + url,
      url: url.indexOf('http') !== -1 ? url : BASE_URL + url+"?"+param,
      header: {
        'content-type': 'application/json',
        'x-api-key': Taro.getStorageSync('Authorization'),
      },
      fileId: data.fileId,
      showToast: showToast,
    })
  },
  get(url, data = '') {
    let option = { url, data };
    return this.baseOptions(option);
  },
  /**
   * post请求
   * @param {*} url 
   * @param {*} data 
   * @param {*} showToast   false-错误信息不统一处理，自行处理
   * @param {*} contentType 
   */
  post: function(url, data, showToast, contentType) {
    let params = { url, data, showToast, contentType };
    return this.baseOptions(params, 'POST');
  },
  put(url, data = '') {
    let option = { url, data };
    return this.baseOptions(option, 'PUT');
  },
  delete(url, data = '') {
    let option = { url, data };
    return this.baseOptions(option, 'DELETE');
  },
  file: function(url, data, showToast) {
    let params = { url, data, showToast };
    return this.fileOptions(params);
  },
  filedownload: function(url, data, showToast) {
    let params = { url, data, showToast }
    return this.filedownOptions(params);
  },
};
