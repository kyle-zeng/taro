import Taro from '@tarojs/taro'
import * as HOME from './action-type'
import API from '../../service/api'

function showError(err, show = true) {
  show && Taro.showToast({
    title: err,
    icon: 'none',
    duration: 5000,
  })
  console.error(err)
}

export const getProCity = (payload, succBack) => {
  // 返回函数，异步dispatch
  const { codAreaLevel  } = payload
  return async dispatch => {
    try {
      let type = HOME.PRO_CITY_GET
      
      const result = await API.post('/getProCity',payload)
      dispatch({
        type: type,
        codAreaLevel: codAreaLevel,
        areaValue: result.data.inqueryProCityInfo.cmsAreaList,
      })
      //查询市信息
      if('1' === codAreaLevel){
        const payload2 = {
          codAreaLevel: '2',
          codAreaParent: result.data.inqueryProCityInfo.cmsAreaList[0].codArea
        }
        const result2 = await API.post('/getProCity',payload2)
        dispatch({
          type: type,
          codAreaLevel: '2',
          areaValue: result2.data.inqueryProCityInfo.cmsAreaList,
        })

        const payload3 = {
          codAreaLevel: '3',
          codAreaParent: result2.data.inqueryProCityInfo.cmsAreaList[0].codArea
        }
        const result3 = await API.post('/getProCity',payload3)
        dispatch({
          type: type,
          codAreaLevel: '3',
          areaValue: result3.data.inqueryProCityInfo.cmsAreaList,
        })
      }
      if('2' === codAreaLevel){
        const payload2 = {
          codAreaLevel: '3',
          codAreaParent: result.data.inqueryProCityInfo.cmsAreaList[0].codArea
        }
        const result2 = await API.post('/getProCity',payload2)
        dispatch({
          type: type,
          codAreaLevel: '3',
          areaValue: result2.data.inqueryProCityInfo.cmsAreaList,
        })
      }
      succBack()
    } catch (err) {
      showError(err)
    }
  }
}
