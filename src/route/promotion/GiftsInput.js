/**
 * Created by wanpeng on 2017/10/26.
 */
import React, {PureComponent, Component} from 'react'
import {
  Button,
  Row,
  Col,
  Input,
  Icon,
  message,
  Upload,
  Modal,
} from 'antd'
import AV from 'leancloud-storage'

class GiftsInput extends  Component {
  constructor(props) {
    super(props)
    const {value} = props
    this.state = {
      previewVisible: false,
      previewImage: '',
      gifts: value || [],
      fileList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    this.setState({gifts: value || []})
  }

  remove = (index) => {
    let gifts = this.state.gifts
    gifts.splice(index, 1)
    this.setState({gifts: gifts})
  }

  add = () => {
    if(this.state.gifts.length < 10) {
      this.setState({
        gifts: this.state.gifts.concat({
          title: undefined,
          stocks: undefined,
          remark: undefined,
          imageList: undefined})
      })
    } else {
      message.warning("奖励金额参数超限")
    }
  }

  triggerChange(index, type, e) {
    const onChange = this.props.onChange
    const { value } = e.target
    let gifts = this.state.gifts
    gifts[index][type] = value
    this.setState({
      gifts: gifts
    })
    if(onChange) {
      onChange(gifts)
    }
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handleChange(index, value) {
    const {file, fileList} = value
    let stateFileList = this.state.fileList
    stateFileList[index] = fileList
    this.setState({ fileList: stateFileList })
    if(file.status === 'done' && file.response) {
      let imageUrlList = []
      fileList.forEach((file) => {
        let url = file.response.attributes.url
        imageUrlList.push(url)
      })
      let gifts = this.state.gifts
      gifts[index].imageList = imageUrlList

      this.setState({ gifts })
      const onChange = this.props.onChange
      if(onChange) {
        onChange(gifts)
      }
    }
  }

  renderRemoveIcon(index) {
    if(this.props.disabled) {
      return null
    }
    return (
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => this.remove(index)}
      />
    )
  }
  renderPlusButton() {
    if(this.props.disabled) {
      return null
    }
    return (
      <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
        <Icon type="plus" /> 增加礼品
      </Button>
    )
  }

  onCustomRequest = (value) => {
    var file = new AV.File(name, value.file)
    file.save({onprogress:function (e) {
      value.onProgress(e)
    }}).then(function(file) {
      value.onSuccess(file)
    }, function(error) {
      value.onError(error)
    });
  }

  render() {
    const { previewVisible, previewImage, fileList, gifts } = this.state;
    const {disabled} = this.props
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传详情图片</div>
      </div>
    );
    const inputItems = gifts.map((k, index) => {
      return (
        <Row key={index} gutter={16}>
          <Col span={10}>
            <Input disabled={disabled}
                   value={gifts[index].title}
                   addonBefore='礼品名称:'
                   onChange={(e) => this.triggerChange(index, 'title', e)}/>
          </Col>
          <Col span={8}>
            <Input disabled={disabled}
                   value={gifts[index].stocks}
                   addonBefore='库存:'
                   type='number'
                   onChange={(e) => this.triggerChange(index, 'stocks', e)}/>
          </Col>
          <Col span={18}>
            <Input disabled={disabled}
                   value={gifts[index].remark}
                   addonBefore='备注:'
                   onChange={(e) => this.triggerChange(index, 'remark', e)}/>
          </Col>
          <Col span={24}>
            <Upload disabled={disabled}
                    customRequest={this.onCustomRequest}
                    listType="picture-card" fileList={fileList[index] || []}
                    onChange={(value) => {this.handleChange(index, value)}}
                    onPreview={this.handlePreview}>
              {(fileList[index] && fileList[index].length >= 3) ? null : uploadButton}
            </Upload>
          </Col>
          <Col>
            {this.renderRemoveIcon(index)}
          </Col>
        </Row>
      )
    })
    return (
      <div>
        {inputItems}
        {this.renderPlusButton()}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

GiftsInput.defaultProps = {
  disabled: false,

}

export default GiftsInput
