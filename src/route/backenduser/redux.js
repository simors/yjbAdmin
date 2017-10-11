import {createAction} from 'redux-actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import {Record, List, Map} from 'immutable';

// --- model

const UserState = Record({
  selectedUserIds: List(),
  checkedUserRoles: List(),
  userDetailModalVisible: false,
  userCreateModalVisible: false,
  userEditModalVisible: false,
}, 'UserState');

// --- constant

const UPDATE_SELECTED_USER_IDS    = 'SYSUSER/UPDATE_SELECTED_USER_IDS';
const UPDATE_CHECKED_USER_ROLES   = 'SYSUSER/UPDATE_CHECKED_USER_ROLES';
const SHOW_USER_DETAIL_MODAL      = 'SYSUSER/SHOW_USER_DETAIL_MODAL';
const HIDE_USER_DETAIL_MODAL      = 'SYSUSER/HIDE_USER_DETAIL_MODAL';
const SHOW_USER_CREATE_MODAL      = 'SYSUSER/SHOW_USER_CREATE_MODAL';
const HIDE_USER_CREATE_MODAL      = 'SYSUSER/HIDE_USER_CREATE_MODAL';
const SHOW_USER_EDIT_MODAL        = 'SYSUSER/SHOW_USER_EDIT_MODAL';
const HIDE_USER_EDIT_MODAL        = 'SYSUSER/HIDE_USER_EDIT_MODAL';

// --- action

export const action = {
  updateSelectedUserIds: createAction(UPDATE_SELECTED_USER_IDS),
  updateCheckedUserRoles: createAction(UPDATE_CHECKED_USER_ROLES),
  showUserDetailModal: createAction(SHOW_USER_DETAIL_MODAL),
  hideUserDetailModal: createAction(HIDE_USER_DETAIL_MODAL),
  showUserCreateModal: createAction(SHOW_USER_CREATE_MODAL),
  hideUserCreateModal: createAction(HIDE_USER_CREATE_MODAL),
  showUserEditModal: createAction(SHOW_USER_EDIT_MODAL),
  hideUserEditModal: createAction(HIDE_USER_EDIT_MODAL),
};

// --- saga

// --- reducer

const initialState = new UserState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_USER_IDS:
      return reduceUpdateSelectedUserIds(state, action);
    case UPDATE_CHECKED_USER_ROLES:
      return reduceUpdateCheckedUserRoles(state, action);
    case SHOW_USER_DETAIL_MODAL:
      return reduceShowUserDetailModal(state, action);
    case HIDE_USER_DETAIL_MODAL:
      return reduceHideUserDetailModal(state, action);
    case SHOW_USER_CREATE_MODAL:
      return reduceShowUserCreateModal(state, action);
    case HIDE_USER_CREATE_MODAL:
      return reduceHideUserCreateModal(state, action);
    case SHOW_USER_EDIT_MODAL:
      return reduceShowUserEditModal(state, action);
    case HIDE_USER_EDIT_MODAL:
      return reduceHideUserEditModal(state, action);
    default:
      return state;
  }
};

function reduceUpdateSelectedUserIds(state, action) {
  const {selected} = action.payload;

  return state.withMutations((m) => {
    m.setIn(['selectedUserIds'], new List(selected));
  })
}

function reduceUpdateCheckedUserRoles(state, action) {
  const {checked} = action.payload;
  console.log('reduceUpdateCheckedUserRoles: ', checked);

  return state.withMutations((m) => {
    m.setIn(['checkedUserRoles'], new List(checked));
  })
}

function reduceShowUserDetailModal(state, action) {
  return state.withMutations((m) => {
    m.setIn(['userDetailModalVisible'], true);
  })
}

function reduceHideUserDetailModal(state, action) {
  return state.setIn(['userDetailModalVisible'], false);
}

function reduceShowUserCreateModal(state, action) {
  return state.withMutations((m) => {
    m.setIn(['userCreateModalVisible'], true);
  })
}

function reduceHideUserCreateModal(state, action) {
  return state.setIn(['userCreateModalVisible'], false);
}

function reduceShowUserEditModal(state, action) {
  return state.withMutations((m) => {
    m.setIn(['userEditModalVisible'], true);
  })
}

function reduceHideUserEditModal(state, action) {
  return state.setIn(['userEditModalVisible'], false);
}

// --- selector

export const selector = {
  selectSelectedUserIds,
  selectCheckedUserRoles,
  selectUserDetailModalVisible,
  selectUserCreateModalVisible,
  selectUserEditModalVisible,
};

function selectSelectedUserIds(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['selectedUserIds'], new List()).toArray();
}

function selectCheckedUserRoles(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['checkedUserRoles'], new List()).toArray();
}

function selectUserDetailModalVisible(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['userDetailModalVisible'], false);
}

function selectUserCreateModalVisible(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['userCreateModalVisible'], false);
}

function selectUserEditModalVisible(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['userEditModalVisible'], false);
}