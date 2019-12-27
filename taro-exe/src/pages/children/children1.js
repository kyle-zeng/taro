/* eslint-disable react/react-in-jsx-scope */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import AddressPicker from '../../components/list-picker/address-picker'
import './children.scss'

class Children1 extends Component {

  state = {
    homeAreaId: [],
    homeAreaInfo: ''
  }

  toggleAddressPicker = (params) => {
    const { tempAreaId, tempAreaInfo, flag } = params
    console.log('homeAreaId:'+tempAreaId + '  homeAreaInfo:' +tempAreaInfo)
    if(flag){
      this.setState({
        homeAreaId: tempAreaId,
        homeAreaInfo: tempAreaInfo,
      },()=>{
        this.handleAreaChange()
      })
    }
  }

  // 将子组件的值传递给父组件
  handleAreaChange = () => {
    this.props.onValueChange(this.state.homeAreaInfo)
  }

  render () {
    return (
      <View className='index'>
         <View className='at-row addr__nowrap'>
          <View className='at-col at-col-1 at-col--auto addr__item'>家庭住址：</View>
          <View className='at-col addr__list'>
            <AddressPicker 
              lab='请选择'
              columns={3}
              addrInitType={0}
              initValue={this.state.homeAreaInfo}
              onHandleToggleShow={this.toggleAddressPicker.bind(this)}/>
          </View>
          </View>
      </View>
    )
  }
}


export default Children1
