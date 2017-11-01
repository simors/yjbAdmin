import React from 'react';
import {connect} from 'react-redux';
import {selector} from './redux';
import Step1 from './promotion-step1';
import Step2 from './promotion-step2';

class Promotion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {curStep} = this.props;
    switch (curStep) {
      case 1:
        return (<Step1/>);
      case 2:
        return (<Step2/>);
      default:
        return (<Step1/>);
    }
  }
}

const mapStateToProps = (appState, ownProps) => {
  const curStep = selector.selectCurStep(appState);

  return {
    curStep,
  };
};

export default connect(mapStateToProps, null)(Promotion);
