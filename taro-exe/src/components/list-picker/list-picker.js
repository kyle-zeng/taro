import { Component } from '@tarojs/taro'
import { View, Picker,Text } from '@tarojs/components'
import './list-picker.scss'


class ListPicker extends Component {
  state = {
    selectValue: ''
  }

  componentDidMount () {
    const { defaultShow} = this.props
    this.setState({
      selectValue: defaultShow
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultShow !== this.props.defaultShow) {
      this.setState({
        selectValue: nextProps.defaultShow
      })
    }
  }

  onValueChange(e) {
    const {range,rangeKey,mode} = this.props
    const index = e.detail.value
    let selectValue = index
    if(mode === 'selector' || mode === 'multiSelector'){
      const entity = range[index]
      selectValue = entity[rangeKey]
    }
    this.setState({
      selectValue: selectValue,
    },() => {
        this.props.onHandValueChange(index)
    })
  }

  render() {
    const { mode, range, rangeKey, lab } = this.props
    const valueShow = this.state.selectValue || lab || '请选择'
    const select = this.state.selectValue?true:false
    return (
      <View>
        <Picker
          mode={mode}
          range={range}
          rangeKey={rangeKey}
          onChange={this.onValueChange.bind(this)}
        >
          <View className='picker-view-wrap'>
            <View className={select?'picker-itemselect':'picker-item'}>
              {valueShow}<Text className='at-icon at-icon-chevron-right picker-item__icon'></Text>
            </View>
          </View>
        </Picker>
      </View>
    )
  }
}

export default ListPicker
