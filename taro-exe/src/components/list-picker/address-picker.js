import { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import { connect } from '@tarojs/redux'
import { getProCity } from '../../store/home/action'
import address from '../../utils/city.js'
import './list-picker.scss'


@connect(
  ({ home,loan }) => ({
    proCityMap: home.proCityMap,
  }),
  {
    dispatchGetProCity: getProCity,
  },
)
class AddressPicker extends Component {
  state = {
    provinces: [],
    citys: [],
    areas: [],
    //地址id
    areaId: [110000, 110100, 110101],
    //地址数组位置
    value: [0, 0, 0],
    //地址名称，页面展示
    areaInfo: '',
    //展示地址级数
    columnCount: 3,
    // 地址数据初始化类型 0-本地文件初始化或一次性拉取 1-实时获取
    addrIDataType: 0 
  }

  componentDidMount(){
    //初始化地址数据
    this.initData()
  }

  initData = () => {
    const { columns, addrInitType, initValue } = this.props
    this.setState({
      columnCount:columns || this.state.columnCount,
      areaInfo: initValue || this.state.areaInfo,
      addrIDataType:addrInitType || this.state.addrIDataType
    })
    if(addrInitType && 1===addrInitType){
      //后端服务器获取数据
      this.getProvices()
    }else{
      //前端js中获取数据
      this.setState({
        provinces: address.provinces,
        citys: address.citys[110000],
        areas: address.areas[110100],
      })
    }
  }

  getProvices = () => {
    const payload = {
      codAreaLevel: '1',
      codAreaParent: ''
    }
    this.props.dispatchGetProCity(payload,this.setStateData)
  }
  getCitys = (codProvice) => {
    const payload = {
      codAreaLevel: '2',
      codAreaParent: codProvice
    }
    this.props.dispatchGetProCity(payload,this.setStateData)
  }
  getDistract = (codCity) => {
    const payload = {
      codAreaLevel: '3',
      codAreaParent: codCity
    }
    this.props.dispatchGetProCity(payload,this.setStateData)
  }

  setStateData = () => {
    const { proCityMap } = this.props
    this.setState({
      provinces: proCityMap.get('1'),
      citys: proCityMap.get('2'),
      areas: proCityMap.get('3')
    })
  }
  //某一列的值改变时触发 columnchange 事件
  columnChange(e) {
    const { provinces, citys, value, addrIDataType } = this.state
    const columnIndex = e.detail.column
    const valueIndex = e.detail.value
    const provincePos = value[0]
    const cityPos = value[1]
    // 滑动了省份，此时市默认是省的第一组数据，
    if (0 === columnIndex) {
      if(1===addrIDataType){
        const pid = provinces[valueIndex].codArea
        this.getCitys(pid)
      }else{
        const pid = provinces[valueIndex].id
        const cid = address.citys[pid][0].id
        this.setState({
          //联动市、区值
          citys: address.citys[pid],
          areas: address.areas[cid],
        })
      }
      this.setState({
        //保存位置
        value: [valueIndex, 0, 0],
      })
    } else if (1 === columnIndex) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      if(1===addrIDataType){
        const cid = citys[valueIndex].codArea
        this.getDistract(cid)
      }else{
        const cid = citys[valueIndex].id
        this.setState({
          //联动区县值
          areas: address.areas[cid],
        })
      }
      this.setState({
        //保存位置
        value: [provincePos, valueIndex, 0],
      })
    } else {
      // 滑动选择了区
      //保存位置
      this.setState({
        value: [provincePos, cityPos, valueIndex],
      })
    }
  }

  //  flag true代表传递地址，false不传递
  onChange(flag) {
    if (flag) {
      const { provinces, citys, areas, value, columnCount } = this.state
      // 将选择的城市信息显示到输入框
      let tempAreaInfo = provinces[value[0]].name + citys[value[1]].name 
      if(columnCount===3){
        tempAreaInfo = tempAreaInfo + areas[value[2]].name
      }
      const tempAreaId = [
        provinces[value[0]].id,
        citys[value[1]].id,
        columnCount===3?areas[value[2]].id:'',
      ]
      //将数据传送到父组件  
      this.setState({
          areaInfo: tempAreaInfo,
          areaId: tempAreaId,
        },() => {
          this.props.onHandleToggleShow({tempAreaId, tempAreaInfo,flag})
        },
      )
    }
  }

  onCancel() {
   this.setStateData()
  }

  render() {
    const { provinces, citys, areas, columnCount, addrIDataType } = this.state
    let range = [provinces, citys]
    if(columnCount === 3){
      range = [provinces, citys, areas]
    }
    const valueShow = this.state.areaInfo || this.props.lab || '请选择'
    const select = this.state.areaInfo?true:false
    return (
      <View>
        <Picker
          mode='multiSelector'
          range={range}
          rangeKey={addrIDataType===0?'name':'namArea'}
          onColumnChange={this.columnChange.bind(this)}
          onCancel={this.onCancel.bind(this)}
          onChange={this.onChange.bind(this, true)}
        >
          <View className='picker-view-wrap'>
            <View className={select?'picker-itemselect':'picker-item'}>
              {/* Picker组件没有箭头图标，需要自己指定 */}
              {valueShow}<Text className='at-icon at-icon-chevron-right picker-item__icon'></Text>
            </View>
          </View>
        </Picker>
      </View>
    )
  }
}

AddressPicker.propTypes = {
  onHandleToggleShow: PropTypes.func.isRequired,
}

export default AddressPicker
