import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import classNames from 'classnames'
import closeIcon from './assets/close.png'
import './index.scss'
import URL from '../../constants/urls'

const NOTICE = `${URL.CDN}/static/pic/popup-notice.png`

export default class Popup extends Component {
  static defaultProps = {
    visible: false,
    compStyle: '',
    title:'',
    onClose: () => {},
    onConfirm: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      isShow: props.visible
    }
  }

  componentWillReceiveProps (nextProps) {
    const { visible } = nextProps
    const { isShow } = this.state
    if (visible !== isShow) {
      this.setState({
        isShow: visible
      })
    }
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleTouchMove = e => {
    e.stopPropagation()
  }

  render () {
    const { onClose, compStyle, title, onConfirm } = this.props
    const { isShow } = this.state

    return (
      <View
        className={classNames('comp-popup', isShow && 'comp-popup--visible')}
        onTouchMove={this.handleTouchMove}
      >
        <View className='comp-popup__mask'/>
        <View className='comp-popup__wrapper' style={compStyle}>
          <Image
            className='comp-popup__image'
            src={NOTICE} />
          <View className='comp-popup__title'>{title}</View>
          <ScrollView
            scrollY
            className='comp-popup__content'
            style={{ height: Taro.pxTransform(300)}}
          >
            {this.props.children}
          </ScrollView>
          <View className='comp-popup__close' onClick={onClose}>
            <Image className='comp-popup__close-img' src={closeIcon} />
          </View>
          <View className='at-row at-row__justify--around comp-popup__button'>
            <View className='at-col at-col-5 one' onClick={onClose}>取消</View>
            <View className='at-col at-col-6 two' onClick={onConfirm}>好的，我知道了</View>
          </View>
        </View>
      </View>
    )
  }
}

