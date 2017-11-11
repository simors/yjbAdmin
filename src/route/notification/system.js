import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {selector} from './redux';
import Step1 from './system-step1';
import Step2 from './system-step2';
import {selector as authSelector} from '../../util/auth/';
import {PERMISSION_CODE} from '../../util/rolePermission/';
import Exception from '../../component/Exception/';

class System extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {curStep, sendSysMsgVisible} = this.props;

    if (sendSysMsgVisible) {
      switch (curStep) {
        case 1:
          return (<Step1/>);
        case 2:
          return (<Step2/>);
        default:
          return (<Step1/>);
      }
    }

    return (<Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />);
  }
}

const mapStateToProps = (appState, ownProps) => {
  const curStep = selector.selectCurStep(appState);
  const sendSysMsgVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.PUSH_SYSTEM_MSG]);

  return {
    curStep,
    sendSysMsgVisible,
  };
};

export default connect(mapStateToProps, null)(System);
