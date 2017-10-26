import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Menu, Icon, Avatar} from 'antd';
import {action as authAction} from '../util/auth/';
import style from './Profile.module.scss';

class Profile extends React.Component {

  onPassword = () => {
    console.log('TODO: change password');
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

  render() {
    return (
      <div className={style.profile}>
        <div style={{display: 'flex', padding: '5px 0'}}>
          <Avatar size='large' icon='user' style={{margin: 'auto'}}/>
        </div>
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

const mapDispatchToProps = {
  ...authAction,
};

export default withRouter(connect(null, mapDispatchToProps)(Profile));
