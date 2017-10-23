import {createAction} from 'redux-actions';
import {Record, Set} from 'immutable';

// --- model

const UserState = Record({
  selectedUserIds: Set(),
}, 'UserState');

// --- constant

const UPDATE_SELECTED_USER_IDS    = 'SYSUSER/UPDATE_SELECTED_USER_IDS';

// --- action

export const action = {
  updateSelectedUserIds: createAction(UPDATE_SELECTED_USER_IDS),
};

// --- saga

// --- reducer

const initialState = new UserState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_USER_IDS:
      return reduceUpdateSelectedUserIds(state, action);
    default:
      return state;
  }
};

function reduceUpdateSelectedUserIds(state, action) {
  const {selected} = action.payload;

  return state.withMutations((m) => {
    m.setIn(['selectedUserIds'], new Set(selected));
  })
}

// --- selector

export const selector = {
  selectSelectedUserIds,
};

function selectSelectedUserIds(appState) {
  const state = appState.ADMINUSER;
  return state.getIn(['selectedUserIds'], new Set()).toArray();
}
