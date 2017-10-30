import {createAction} from 'redux-actions';
import {Record} from 'immutable';

// --- model

const ProfileState = Record({
  passwordModalVisible: false,
}, 'ProfileState');

// --- constant

const SHOW_PASSWORD_MODAL = 'PROFILE/SHOW_PASSWORD_MODAL';
const HIDE_PASSWORD_MODAL = 'PROFILE/HIDE_PASSWORD_MODAL';

// --- action

export const action = {
  showPasswordModal: createAction(SHOW_PASSWORD_MODAL),
  hidePasswordModal: createAction(HIDE_PASSWORD_MODAL),
};

// --- saga

// --- reducer

const initialState = new ProfileState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case SHOW_PASSWORD_MODAL:
      return reduceShowPasswordModal(state, action);
    case HIDE_PASSWORD_MODAL:
      return reduceHidePasswordModal(state, action);
    default:
      return state;
  }
};

function reduceShowPasswordModal(state, action) {
  return state.withMutations((m) => {
    m.setIn(['passwordModalVisible'], true);
  })
}

function reduceHidePasswordModal(state, action) {
  return state.setIn(['passwordModalVisible'], false);
}

// --- selector

export const selector = {
  selectPasswordModalVisible,
};

function selectPasswordModalVisible(appState) {
  const state = appState.PROFILE;
  return state.getIn(['passwordModalVisible'], false);
}
