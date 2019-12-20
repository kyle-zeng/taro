/* eslint-disable react/react-in-jsx-scope */
import Taro, { Component } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import AtImagePicker from '../image-picker'
import { connect } from '@tarojs/redux'


@connect(
  ({ home, user }) => ({
    fileNameKeyValue: home.fileNameKeyValue,
  }),
  {
  },
)
class ChooseImage extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      length: 1,
      fileCount:1,
      nameList: [],
      files: [],
      filesType: '',
      upLoadImg: [],
      //是否压缩
      compression:true,
      //调整比率
      ratio: 2,
      //压缩图宽限制 800-28s  600-21s
      phtoWidth: 750,
      //压缩图高限制
      phtoHeight: 750,
      //图片最终尺寸
      cWidth: 0,
      cHeight: 0,
    }
  }

  componentWillMount() {
    console.log(this.props.chooseImg)
    const { files, fileCount, length, upLoadImg, nameList, filesType,
      compression, ratio, phtoWidth, phtoHeight } = this.props.chooseImg
    this.setState({
      length: length,
      fileCount: fileCount,
      files: files,
      filesType: filesType,
      nameList: nameList,
      upLoadImg: upLoadImg,

      compression: compression || this.state.compression,
      ratio: ratio || this.state.ratio,
      phtoWidth: phtoWidth || this.state.phtoWidth,
      phtoHeight: phtoHeight || this.state.phtoHeight,
    })
  }

  onChange(v, doType, index) {
    const { fileCount } = this.state
    // doType代表操作类型，移除图片和添加图片,index为移除图片时返回的图片下标
    if (doType === 'remove') {
      this.setState(
        prevState => {
          let oldSendImg = prevState.upLoadImg
          oldSendImg.splice(oldSendImg[index], 1) // 删除已上传的图片地址
          return {
            files: v,
            upLoadImg: oldSendImg,
          }
        },() => {
        })
        this.toDelete(index)
    } else {
      this.setState({
        files: v,
      },() => {
        this.toUpload(index)
      })
    }
  }
  toDelete = (index) => {
    const { fileNameKeys } = this.props.chooseImg
    const fileNameKey = fileNameKeys[index]
    const fileNameKeyValue = ''
    this.props.onFilesValue({fileNameKey, fileNameKeyValue})
  }

  toUpload = (index) => {
    const { files, compression } = this.state
    if (files.length > 0) {
      const { fileNameKeys, uploadType } = this.props.chooseImg
      let fileNameKey = ''
      fileNameKeys.map((valus,indexT) => {
        if(index === indexT){
          fileNameKey = fileNameKeys[indexT]
        }
      })
      const filePath = files[index]
      const fileSize = filePath.file.size
      compression&&fileSize>100*1024?
      this.getCanvasImg(fileNameKey,filePath,uploadType)
      :
      this.uploadLoader(fileNameKey,filePath.url,uploadType)
    } else {
      Taro.showToast({
        title: '请先点击+号选择图片',
        icon: 'none',
        duration: 2000,
      })
    }
  }
  //压缩图片并上传图片
  getCanvasImg = (fileNameKey,filePath,uploadType) => {
    const that = this
    const { ratio, phtoWidth, phtoHeight } = this.state
    Taro.getImageInfo({
      src: filePath.file.path
    }).then(res => {
      
      let ratioT = ratio
      let canvasWidth = res.width
      let canvasHeight = res.height
      // 保证宽高均在200以内
      while (canvasWidth > phtoWidth || canvasHeight > phtoHeight) {
        //比例取整
        canvasWidth = Math.trunc(res.width / ratioT)
        canvasHeight = Math.trunc(res.height / ratioT)
        ratioT++
      }
      that.setState({
        cWidth: canvasWidth,
        cHeight: canvasHeight
      })
      // setTimeout(() => {
        if(process.env.TARO_ENV === 'h5'){
          const ctx = Taro.createCanvasContext("canone")
          var img = new Image()
          img.src = filePath.file.path
          img.onload = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, () => {
              Taro.canvasToTempFilePath({
                canvasId: "canone",
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                fileType: "jpeg",
                success: res2 => {
                  // 上传压缩后的图片 res2.tempFilePath
                  const blob = this.convertBase64UrlToBlob(res2.tempFilePath)
                  const urlB = URL.createObjectURL(blob)
                  console.log('------urlB---------',urlB)
                  this.uploadLoader(fileNameKey,urlB,uploadType)
                }
              })
            })
          }
        }else{
          const ctx = Taro.createCanvasContext("canone",this.$scope)
          setTimeout(() => {
            ctx.drawImage(filePath.file.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(true, () => {
              Taro.canvasToTempFilePath({
                canvasId: "canone",
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: res2 => {
                  // 上传压缩后的图片 res2.tempFilePath
                  this.uploadLoader(fileNameKey,res2.tempFilePath,uploadType)
                }
              },this.$scope)
            })
          }, 0)
        }
    })
  }
  convertBase64UrlToBlob(urlData){
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
    while(n--){
        u8arr[n] = bstr.charCodeAt(n)
    }
    var b = new Blob([u8arr], {type:mime})
    return b
  }

  // 上传组件
  uploadLoader = (fileNameKey,filePath,uploadType) => {
    const payload = {
      filePath: filePath,
      formData: {
        fileNameKey: fileNameKey,
      },
    }
  }
 // 选择失败回调
  onFail(mes) {
    console.log(mes)
  }
// 点击图片回调
  onImageClick(index, file) {
    let imgs = []
    this.state.files.map((item, index) => {
      imgs.push(item.file.path)
    })
    if (imgs[index].indexOf('.pdf') > -1 || imgs[index].indexOf('.PDF') > -1) {
      Taro.downloadFile({
        url: imgs[index],
        success: function(res) {
          let filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功')
            },
          })
        },
      })
    } else {
      Taro.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs,
      })
    }
  }
  render() {
    const { length, fileCount,files, nameList, filesType, cWidth, cHeight } = this.state
    return (
      <View>
        <View style='position:absolute;left:-1000px;top:-1000px;'>
          <Canvas canvasId='canone' style={{ width: cWidth+'px', height:cHeight+'px'}}></Canvas>
        </View>
        <AtImagePicker
          multiple={false}
          length={length} //单行的图片数量
          fileCount={fileCount} //图片总数量
          files={files}
          filesType={filesType} //图片类型 'idcard' --身份证
          nameList={nameList} //图片下表名列表
          onChange={this.onChange.bind(this)}
          onFail={this.onFail.bind(this)}
          onImageClick={this.onImageClick.bind(this)}
          sizeType={['compressed']}
        />
      </View>
    )
  }
}

export default ChooseImage
