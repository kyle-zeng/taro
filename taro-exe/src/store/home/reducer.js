import * as HOME from './action-type'

const defaultState = {
  proCityMap: new Map()
}

const home = (state = defaultState, action) => {
  switch (action.type) {
      case HOME.PRO_CITY_GET:
        return {
          ...state, 
          proCityMap: state.proCityMap.set(action.codAreaLevel,action.areaValue)
        }
    default:
      return state
  }
}

export default home
