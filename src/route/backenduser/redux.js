import {createAction} from 'redux-actions';
import {Record, Set} from 'immutable';

// --- model

const UserState = Record({
  curOpUserId: undefined,
  selectedUserIds: Set(),
  checkedUserRoles: Set(),
  userDetailModalVisible: false,
  userCreateModalVisible: false,
  userEditModalVisible: false,
}, 'UserState');

// --- constant

const UPDATE_CUR_OP_USER_ID       = 'ADMIN/USER/UPDATE_CUR_OP_USER_ID';
const UPDATE_SELECTED_USER_IDS    = 'ADMIN/USER/UPDATE_SELECTED_USER_IDS';
const SHOW_USER_DETAIL_MODAL      = 'ADMIN/USER/SHOW_USER_DETAIL_MODAL';
const HIDE_USER_DETAIL_MODAL      = 'ADMIN/USER/HIDE_USER_DETAIL_MODAL';
const SHOW_USER_CREATE_MODAL      = 'ADMIN/USER/SHOW_USER_CREATE_MODAL';
const HIDE_USER_CREATE_MODAL      = 'ADMIN/USER/HIDE_USER_CREATE_MODAL';
const SHOW_USER_EDIT_MODAL        = 'ADMIN/USER/SHOW_USER_EDIT_MODAL';
const HIDE_USER_EDIT_MODAL        = 'ADMIN/USER/HIDE_USER_EDIT_MODAL';

// --- action

export const action = {
  updateCurOpUserId: createAction(UPDATE_CUR_OP_USER_ID),
  updateSelectedUserIds: createAction(UPDATE_SELECTED_USER_IDS),
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
    case UPDATE_CUR_OP_USER_ID:
      return reduceUpdateCurOpUserId(state, action);
    case UPDATE_SELECTED_USER_IDS:
      return reduceUpdateSelectedUserIds(state, action);
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

function reduceUpdateCurOpUserId(state, action) {
  const {curOpUserId} = action.payload;

  return state.withMutations((m) => {
    m.set('curOpUserId', curOpUserId);
  })
}

function reduceUpdateSelectedUserIds(state, action) {
  const {selected} = action.payload;

  return state.withMutations((m) => {
    m.setIn(['selectedUserIds'], new Set(selected));
  })
}

function reduceShowUserDetailModal(state, action) {
  const {curOpUserId} = action.payload;

  return state.withMutations((m) => {
    m.set('curOpUserId', curOpUserId);
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
  const {curOpUserId} = action.payload;

  return state.withMutations((m) => {
    m.set('curOpUserId', curOpUserId);
    m.setIn(['userEditModalVisible'], true);
  })
}

function reduceHideUserEditModal(state, action) {
  return state.setIn(['userEditModalVisible'], false);
}

// --- selector

export const selector = {
  selectCurOpUserId,
  selectSelectedUserIds,
  selectCheckedUserRoles,
  selectUserDetailModalVisible,
  selectUserCreateModalVisible,
  selectUserEditModalVisible,
};

function selectCurOpUserId(appState) {
  const state = appState.BACKENDUSER;
  return state.get('curOpUserId');
}

function selectSelectedUserIds(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['selectedUserIds'], new Set()).toArray();
}

function selectCheckedUserRoles(appState) {
  const state = appState.BACKENDUSER;
  return state.getIn(['checkedUserRoles'], new Set()).toArray();
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
