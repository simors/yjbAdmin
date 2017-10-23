import {createAction} from 'redux-actions';
import {Record, Set} from 'immutable';

// --- model

const UserState = Record({
  selectedUserIds: Set(),
  needResetFilter: false,
}, 'UserState');

// --- constant

const UPDATE_SELECTED_USER_IDS    = 'END/USER/UPDATE_SELECTED_USER_IDS';
const RESET_FILTER                = 'END/USER/RESET_FILTER';

// --- action

export const action = {
  updateSelectedUserIds: createAction(UPDATE_SELECTED_USER_IDS),
  resetFilter: createAction(RESET_FILTER),
};

// --- saga

// --- reducer

const initialState = new UserState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_USER_IDS:
      return reduceUpdateSelectedUserIds(state, action);
    case RESET_FILTER:
      return reduceNeedResetFilter(state, action);
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

function reduceNeedResetFilter(state, action) {
  const {reset} = action.payload;

  return state.withMutations((m) => {
    m.set('needResetFilter', reset);
  });
}

// --- selector

export const selector = {
  selectSelectedUserIds,
  selectNeedResetFilter,
};

function selectSelectedUserIds(appState) {
  const state = appState.ENDUSER;
  return state.getIn(['selectedUserIds'], new Set()).toArray();
}

function selectNeedResetFilter(appState) {
  const state = appState.ENDUSER;
  return state.getIn(['needResetFilter'], false);
}
