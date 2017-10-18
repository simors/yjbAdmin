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

cities.forEach((city) => {
  const matchProvince = provinces.filter(province => province.code === city.parent_code)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children,
    });
  }
});

const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));


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

  onSelectChange = (value) => {
    this.setState({value: value})
    this.triggerChange(value)
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  render() {
    return (
      <Cascader style={{width: `200px`}}
                options={options}
                value={this.state.value}
                placeholder="省／市／区"
                changeOnSelect
                disabled={this.props.disabled}
                onChange={this.onSelectChange} />
    )
  }
}

DivisionCascader.defaultProps = {
  disabled: false,
  onChange: () => {},
}

export default DivisionCascader
