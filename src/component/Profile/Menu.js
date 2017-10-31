import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Menu, Icon, Avatar} from 'antd';
import {action} from './redux';
import {action as authAction, selector as authSelector} from '../../util/auth/';
import style from './Menu.module.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  onPassword = () => {
    this.props.showPasswordModal({});
  };

  userMenuOnClick = ({key}) => {
    if (key === 'logout') {
      this.props.onClick();
      this.props.logout({
        onComplete: () => {
          this.props.history.push('/login');
        }
      });
    } else if (key === 'password') {
      this.props.onClick();
      this.onPassword();
    }
  };

  renderUser = () => {
    const {curUser} = this.props;

    let avatar = <Avatar size='large' icon='user' style={{margin: 'auto'}}/>;
    let mobilePhoneNumber = null;

    if (curUser && curUser.avatar) {
      avatar = <Avatar size='large' src={curUser.avatar} style={{margin: 'auto'}}/>;
    }

    if (curUser && curUser.mobilePhoneNumber) {
      mobilePhoneNumber = <span style={{lineHeight: '42px', margin: 'auto'}}>{curUser.mobilePhoneNumber}</span>;
    }

    return (
      <div>
        <div style={{display: 'flex', padding: '8px 0 0'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', height: '42px'}}>
          {mobilePhoneNumber}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={style.menu}>
        {this.renderUser()}
        <div>
          <Menu onClick={this.userMenuOnClick}>
            <Menu.Divider/>
            <Menu.Item key='password'>
              <span><Icon type='edit'/>修改密码</span>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key='logout'>
              <span><Icon type='logout'/>注销</span>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (appState, ownProps) => {
  const curUser = authSelector.selectCurUser(appState);

  return {
    curUser,
  };
};

const mapDispatchToProps = {
  ...action,
  ...authAction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
