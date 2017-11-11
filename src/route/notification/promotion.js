import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {selector} from './redux';
import Step1 from './promotion-step1';
import Step2 from './promotion-step2';
import {selector as authSelector} from '../../util/auth/';
import {PERMISSION_CODE} from '../../util/rolePermission/';
import Exception from '../../component/Exception/';

class Promotion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {curStep, sendMarketingMsgVisible} = this.props;

    if (sendMarketingMsgVisible) {
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
  const sendMarketingMsgVisible = authSelector.selectValidPermissions(appState, [PERMISSION_CODE.PUSH_MARKETING_MSG]);

  return {
    curStep,
    sendMarketingMsgVisible,
  };
};

export default connect(mapStateToProps, null)(Promotion);
