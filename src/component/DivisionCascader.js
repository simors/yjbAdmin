/**
 * Created by wanpeng on 2017/9/23.
 */
import React, {PureComponent} from 'react'
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'
import {connect} from 'react-redux'
import {selector as authSelector, action as authAction} from '../util/auth'

import {
  Cascader,
} from 'antd'

const provincesLevel2 = JSON.parse(JSON.stringify(provinces))
const citiesLevel2 = JSON.parse(JSON.stringify(cities))
const provincesLevel3 = JSON.parse(JSON.stringify(provinces))

areas.forEach((area) => {
  const matchCity = cities.filter(city => city.code === area.parent_code)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.code,
    });
  }
});

citiesLevel2.forEach((city) => {
  const matchProvince = provincesLevel2.filter(province => province.code === city.parent_code)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children,
    });
  }
});

cities.forEach((city) => {
  const matchProvince = provincesLevel3.filter(province => province.code === city.parent_code)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children,
    });
  }
});

const optionsLevel1 = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));

const optionsLevel2 = provincesLevel2.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));

const optionsLevel3 = provincesLevel3.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));

function getOptionData(level) {
  switch (level) {
    case 3:
      return optionsLevel3
    case 2:
      return optionsLevel2
    case 1:
      return optionsLevel1
    default:
      return optionsLevel3
  }
}

function getPlaceholder(level) {
  switch (level) {
    case 3:
      return "省／市／区"
    case 2:
      return "省／市"
    case 1:
      return "省份"
    default:
      return "省／市／区"
  }
}

class DivisionCascader extends PureComponent {
  constructor(props) {
    super(props)
    const value = props.value
    this.state = {
      value: value,
    }
  }

  componentWillMount() {
    // console.log('curUserDivision?????????????????????========>',this.props.curUserDivision)
    if(this.props.value&&this.props.value.length>0){
      this.setState({value: this.props.value})
      this.triggerChange(this.props.value)
    }else{
      this.setState({value: this.props.curUserDivision})
      this.triggerChange(this.props.curUserDivision)
    }
  }

  // componentDidMount() {
  //   this.setState({value: this.props.curUserDivision})
  //
  // }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      if(value&&value.length>0){
        this.setState({value: value})
      }
    }
  }

  onSelectChange = (value, selectOptions) => {
    this.setState({value: value})
    this.triggerChange(value, selectOptions)
  }

  triggerChange = (changedValue,selectOptions) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue,selectOptions)
    }
  }

  render() {
    const {disabled, level, cascaderSize, width, curUserDivision} = this.props
    console.log('curUserDivision========>',curUserDivision)
    console.log('this.state.value========>',this.state.value)

    return (
      <Cascader
                defaultValue={curUserDivision}
                options={getOptionData(level)}
                value={this.state.value}
                placeholder={getPlaceholder(level)}
                size={cascaderSize}
                changeOnSelect
                disabled={disabled}
                style={{width: width}}
                onChange={this.onSelectChange} />
    )
  }
}

DivisionCascader.defaultProps = {
  level: 3,   //3：省市区 2：省市 1：省／
  disabled: false,
  onChange: () => {},
  cascaderSize: 'default',
  width: '200px'
}

const mapStateToProps = (appState, ownProps) => {
  let curUser = authSelector.selectCurUser(appState)
  let curUserDivision = []
  if(curUser&&curUser.province){
    curUserDivision[0] = curUser.province.value
  }
  if(curUser&&curUser.city){
    curUserDivision[1] = curUser.city.value
  }
  if(curUser&&curUser.area){
    curUserDivision[2] = curUser.area.value
  }

  return {
    // curUser: curUser,
    curUserDivision: curUserDivision
  }
}

const mapDispatchToProps = {
  ...authAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(DivisionCascader)
