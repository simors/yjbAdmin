import {createAction} from 'redux-actions';
import {Record, Set} from 'immutable';

// --- model

const UserState = Record({
  loading: false,
  selectedUserIds: Set(),
  needResetFilter: false,
}, 'UserState');

// --- constant

const CHANGE_LOADING              = 'END/USER/CHANGE_LOADING';
const UPDATE_SELECTED_USER_IDS    = 'END/USER/UPDATE_SELECTED_USER_IDS';
const RESET_FILTER                = 'END/USER/RESET_FILTER';

// --- action

export const action = {
  changeLoading: createAction(CHANGE_LOADING),
  updateSelectedUserIds: createAction(UPDATE_SELECTED_USER_IDS),
  resetFilter: createAction(RESET_FILTER),
};

// --- saga

// --- reducer

const initialState = new UserState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case CHANGE_LOADING:
      return reduceChangeLoading(state, action);
    case UPDATE_SELECTED_USER_IDS:
      return reduceUpdateSelectedUserIds(state, action);
    case RESET_FILTER:
      return reduceNeedResetFilter(state, action);
    default:
      return state;
  }
};

function reduceChangeLoading(state, action) {
  const {loading} = action.payload;

  return state.withMutations((m) => {
    m.set('loading', loading);
  });
}

function reduceUpdateSelectedUserIds(state, action) {
  const {selected} = action.payload;

  return state.withMutations((m) => {
    m.setIn(['selectedUserIds'], new Set(selected));
  })
}

function reduceNeedResetFilter(state, action) {
  return state.withMutations((m) => {
    const reset = m.get('needResetFilter');
    m.set('needResetFilter', !reset);
  });
}

// --- selector

export const selector = {
  selectLoading,
  selectSelectedUserIds,
  selectNeedResetFilter,
};

function selectLoading(appState) {
  const state = appState.ENDUSER;
  return state.get('loading');
}

function selectSelectedUserIds(appState) {
  const state = appState.ENDUSER;
  return state.getIn(['selectedUserIds'], new Set()).toArray();
}

function selectNeedResetFilter(appState) {
  const state = appState.ENDUSER;
  return state.getIn(['needResetFilter'], false);
}
