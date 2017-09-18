import React from 'react';
import {Col, Input, Button} from 'antd';

const SearchBox = (props) => {
  return (
    <div style={{display: "flex", paddingBottom: "8px"}}>
      <div style={{display: "inline-block"}}>姓名</div><Col span="4"><Input maxLength="25" /></Col>
      <div style={{fontSize: "1em"}}>手机号码</div><Col span="8"><Input /></Col>
      <Button style={{marginLeft: "auto"}}>查询</Button>
      <Button>重置</Button>
    </div>
  );
};

export default SearchBox;
