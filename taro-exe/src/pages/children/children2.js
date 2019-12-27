/* eslint-disable react/react-in-jsx-scope */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import AddressPicker from '../../components/list-picker/address-picker'
import './children.scss'

class Children2 extends Component {

  state = {
    info: ''
  }

// 接收父组件传递来的属性值
  componentWillReceiveProps(nextProps){
    if (nextProps.areaInfo !== this.props.areaInfo) {
      this.setState({
        info: nextProps.areaInfo
      })
    }
  }
// 页面渲染从父组件获取的值
  render () {
    const {info} = this.state
    return (
      <View className='children2'>
        我来自 <Text className='infotext'>{info}</Text>。
      </View>
    )
  }
}

export default Children2
