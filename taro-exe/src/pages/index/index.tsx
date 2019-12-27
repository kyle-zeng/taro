import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import AddressPicker from '../../components/list-picker/address-picker'
import { AtImagePicker  } from 'taro-ui'
import ChooseImage from '../../components/image-choose'
import './index.scss'
import Children1 from '../children/children1'
import Children2 from '../children/children2'
export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  state = {
    areaId: [],
    areaInfo: '',
    files: [],
    chooseImg: {
      files: [],
      // 图片总数量
      fileCount: 2,
      length:2,
      filesType:'idcard',
      fileNameKeys: ['pic1'],
      showUploadBtn:true,
      upLoadImg:[]
    },
    children1V: ''
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toggleAddressPicker = (params) => {
    const { tempAreaId, tempAreaInfo, flag } = params
    console.log('areaId:'+tempAreaId + '  areaInfo:' +tempAreaInfo)
    if(flag){
      this.setState({
        areaId: tempAreaId,
        areaInfo: tempAreaInfo,
      })
    }
  }

  onChange (files) {
    this.setState({
      files
    })
  }
  onFail (mes) {
    console.log(mes)
  }
  onImageClick (index, file) {
    console.log(index, file)
  }

  getOnFilesValue = (params) => {
    const { fileNameKey, fileNameKeyValue } = params
    console.log(fileNameKey,fileNameKeyValue)
    this.setState({
      [fileNameKey]: fileNameKeyValue
    })
  }
  // 接收Children1子组件传来的值
  handleValueChange = (value) => {
    console.log('接收Children1子组件传来的值===>',value)
    this.setState({
      children1V: value
    })
  }

  render () {
    return (
      <View className='index'>
        <View className='title'>
          1、地址三级联动：
        </View>
        <View className='at-row addr__nowrap'>
          <View className='at-col at-col-1 at-col--auto addr__item'>住址</View>
          <View className='at-col addr__list'>
            <AddressPicker 
              lab='请选择'
              columns={3}
              addrInitType={0}
              initValue={this.state.areaInfo}
              onHandleToggleShow={this.toggleAddressPicker.bind(this)}/>
          </View>
        </View>

        <View className='title'>
          2、图片选择器改造：
        </View>
        <View>
          <AtImagePicker
            // multiple={false}
            length={4} //单行的图片数量
            files={this.state.files}
            onChange={this.onChange.bind(this)}
            onFail={this.onFail.bind(this)}
            onImageClick={this.onImageClick.bind(this)}/>
          <ChooseImage 
            chooseImg = {this.state.chooseImg}
            onFilesValue={this.getOnFilesValue.bind(this)} />
        </View>

        <View className='title'>
          3、父子组件，兄弟组件之间值传递：
        </View>
        <View>
          {/*传递一个函数给子组件1，接收子组件1状态值  */}
          <Children1 onValueChange = {this.handleValueChange}/>
          {/* 将子组件1获取的值传递给子组件2 */}
          <Children2 areaInfo = {this.state.children1V}/>
        </View>
        
      </View>
    )
  }
}
