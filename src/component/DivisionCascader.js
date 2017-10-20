/**
 * Created by wanpeng on 2017/9/23.
 */
import React, {PureComponent} from 'react'
import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'
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

class DivisionCascader extends PureComponent {
  constructor(props) {
    super(props)
    const value = props.value
    this.state = {
      value: value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({value: value})
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
    const {disabled, level} = this.props
    return (
      <Cascader style={{width: `200px`}}
                options={getOptionData(level)}
                value={this.state.value}
                placeholder="省／市／区"
                changeOnSelect
                disabled={disabled}
                onChange={this.onSelectChange} />
    )
  }
}

DivisionCascader.defaultProps = {
  level: 3,   //3：省市区 2：省市 1：省／
  disabled: false,
  onChange: () => {},
}

export default DivisionCascader
