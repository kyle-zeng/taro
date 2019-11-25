import Taro from '@tarojs/taro';
import BASE_URL from './config';

function showError(message, show = false, data) {
  !show && Taro.atMessage({
      'message': message || '请求异常',
      'type': 'error',
      'duration':5000
    })
   return  show?data : Promise.reject(message);
}

const customInterceptor = function(chain) {
  const requestParams = chain.requestParams;
  const { showToast } = requestParams;
  return chain
    .proceed(requestParams)
    .catch(res => {
      console.log('errInterceptor===============>', res);
      // 这个catch需要放到前面才能捕获request本身的错误，因为showError返回的也是Promise.reject
      return showError(res.data.message, showToast);
    })
    .then(res => {
      // console.log('resInterceptor===============>', res);
      // 只要请求成功，不管返回什么状态码，都走这个回调
      if (res.statusCode === 200) {
        if (!res.data.success) {
          if (res.data.code == 600) {
            Taro.navigateTo({
              url: '/pages/user-login-phone/user-login-phone',
            });
            return Promise.reject(res.data &&res.data.message);
          }else{
            const errorMsg = res.data && res.data.message;
            return showError(errorMsg, showToast,res.data);
          }
        } else {
          if (requestParams.url == BASE_URL + '/unifyRegLogin') {
            Taro.setStorageSync('Authorization', res.data.data);
          }
          return res.data;
        }
      } else {
        return res.data;
      }
    });
};

const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];

export default interceptors;
