import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AtComponent from '../../utils/component'
import { uuid } from '../../utils/utils'
import '../../styles/index.scss'
import ImagePic from './assets/image-picker.png'
import URL from '../../constants/urls'

const NORMAL = `${URL.CDN}/static/pic/image-picker-bg.png`
const ID_CARD_FRONT = `${URL.CDN}/static/pic/image-picker-bg-p1.png`
const ID_CARD_BACK = `${URL.CDN}/static/pic/image-picker-bg-p2.png`

// 生成 jsx 二维矩阵
const generateMatrix = (files, col, fileCount) => {
  const matrix = []
  let fileLen = files.length
  const row = Math.ceil(fileCount / col)
  let matrixLen = 0
  for (let i = 0; i < row; i++) {
    let tempArray = []
    if(fileLen > 0){
      tempArray = files.slice(i * col, (i + 1) * col)
      matrixLen += tempArray.length
      fileLen -= tempArray.length
    }
    if (tempArray.length < col) {//图片不够，则补齐
      for (let j = tempArray.length; j < col; j++) {
        if (matrixLen<fileCount) {
          // 补添加按钮
          tempArray.push({ type: 'btn', uuid: uuid() })
          matrixLen++
        }else{
          // 填补剩下的空列
          tempArray.push({ type: 'blank', uuid: uuid() })
          matrixLen++
        }
      }
    }
    matrix.push(tempArray)
  }
  return matrix
}

const ENV = Taro.getEnv()

class AtImagePicker extends AtComponent {
  chooseFile = (idx) => {
    const { files = [], multiple, count, sizeType, sourceType } = this.props
    const filePathName = ENV === Taro.ENV_TYPE.ALIPAY ? 'apFilePaths' : 'tempFiles'
    // const count = multiple ? 99 : 1
    const params = {}
    if (multiple) { params.count = 99 }
    if (count) { params.count = count }
    if (sizeType) { params.sizeType = sizeType }
    if (sourceType) { params.sourceType = sourceType }
    Taro.chooseImage(params).then(res => {
      if(multiple){
        const targetFiles = res.tempFilePaths.map(
          (path, i) => ({
            url: path,
            file: res[filePathName][i]
          })
        )
        const newFiles = files.concat(targetFiles)
        this.props.onChange(newFiles, 'add', idx)
      }else{
        const url = res.tempFilePaths[0]
        const file = res[filePathName][0]
        files[idx] = {url: url,file: file}
        const newFiles2 = files
        this.props.onChange(newFiles2, 'add', idx)
      }
    }).catch(this.props.onFail)
  }

  handleImageClick = idx => this.props.onImageClick(idx, this.props.files[idx])

  handleRemoveImg = idx => {
    const { files = [], multiple } = this.props
    if (ENV === Taro.ENV_TYPE.WEB) {
      window.URL.revokeObjectURL(files[idx].url)
    }
    if(multiple){
      const newFiles = files.filter((file, i) => i !== idx)
      this.props.onChange(newFiles, 'remove', idx)
    }else{
      files[idx].url = ''
      files[idx].type = 'btn'
      const newFiles2 = files
      this.props.onChange(newFiles2, 'remove', idx)
    }
  }

  render () {
    const {
      className,
      customStyle,
      mode,
      length,
      fileCount,
      files,
      filesType,
      nameList
    } = this.props
    // 行数
    const matrix = generateMatrix(files, length, fileCount)
    const rootCls = classNames('at-image-picker', className)
    return <View className={rootCls} style={customStyle}>
      {matrix.map((row, i) => (
        <View className='at-image-picker__flex-box' key={i + 1}>
          {row.map((item, j) => (
            item.url
              ? <View className='at-image-picker__flex-item' key={(i * length) + j}>
                <View className='at-image-picker__item'>
                  <View
                    className='at-image-picker__remove-btn'
                    onClick={this.handleRemoveImg.bind(this, (i * length) + j)}
                  ></View>
                  <Image
                    className='at-image-picker__preview-img'
                    mode={mode}
                    src={item.url}
                    onClick={this.handleImageClick.bind(this, (i * length) + j)}
                  />
                </View>
              </View>
              : <View className='at-image-picker__flex-item' key={(i * length) + j}>
                {item.type === 'btn' && (
                  <View
                    className='at-image-picker__item at-image-picker__choose-btn'
                    onClick={this.chooseFile.bind(this, (i * length) + j)}
                  >
                    {/* <View className='add-bar'></View>
                    <View className='add-bar'></View> */}
                     <Image
                      className='back-image'
                      src={filesType==='idcard'?(j===0?ID_CARD_FRONT:ID_CARD_BACK):NORMAL} />
                    <Image
                      className='add-image'
                      src={ImagePic} />
                    {/* <View className='add-text'> {nameList[(i * length) + j]}</View> */}
                  </View>
                )}
              </View>
          ))}
        </View>
      ))}
    </View>
  }
}

AtImagePicker.defaultProps = {
  isTest: false,
  className: '',
  customStyle: '',
  files: [],
  mode: 'aspectFill',
  showAddBtn: true,
  multiple: false,
  length: 2,
  onChange: () => {},
  onImageClick: () => {},
  onFail: () => {},
  nameList: [],
}

AtImagePicker.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  customStyle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isTest: PropTypes.bool,
  files: PropTypes.array,
  mode: PropTypes.oneOf([
    'scaleToFill',
    'aspectFit',
    'aspectFill',
    'widthFix',
    'top',
    'bottom',
    'center',
    'left',
    'right',
    'top left',
    'top right',
    'bottom left',
    'bottom right'
  ]),
  showAddBtn: PropTypes.bool,
  multiple: PropTypes.bool,
  length: PropTypes.number,
  onChange: PropTypes.func,
  onImageClick: PropTypes.func,
  onFail: PropTypes.func,
  count: PropTypes.number,
  sizeType: PropTypes.array,
  sourceType: PropTypes.array,
  nameList: PropTypes.array,
}
export default AtImagePicker