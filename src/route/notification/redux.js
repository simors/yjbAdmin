import {call, put, takeLatest} from 'redux-saga/effects';
import {createAction} from 'redux-actions';
import {Record} from 'immutable';
import * as api from './cloud';

// --- model

const NotificationState = Record({
  curStep: 1,
  sending: false,
}, 'NotificationState');

// --- constant

const SEND_SYSTEM_NOTIFICATION    = 'NOTIFICATION/SEND_SYSTEM_NOTIFICATION';
const SEND_PROMOTION_NOTIFICATION = 'NOTIFICATION/SEND_PROMOTION_NOTIFICATION';
const UPDATE_STEP                 = 'NOTIFICATION/UPDATE_STEP';
const UPDATE_SENDING              = 'NOTIFICATION/UPDATE_SENDING';

// --- action

const sendSystemNotification = createAction(SEND_SYSTEM_NOTIFICATION);
const sendPromotionNotification = createAction(SEND_PROMOTION_NOTIFICATION);
const updateStep = createAction(UPDATE_STEP);
const updateSending = createAction(UPDATE_SENDING);

export const action = {
  sendSystemNotification,
  sendPromotionNotification,
  updateStep,
  updateSending,
};

// --- saga

export const saga = [
  takeLatest(SEND_SYSTEM_NOTIFICATION, sagaSendSystemNotification),
  takeLatest(SEND_PROMOTION_NOTIFICATION, sagaSendPromotionNotification),
];

function* sagaSendSystemNotification(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      limit: params.limit,
      content: params.content,
    } = payload);

    yield call(api.sendSystemNotification, params);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('send system notification failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

function* sagaSendPromotionNotification(action) {
  const payload = action.payload;

  try {
    const params = {
    };

    ({
      limit: params.limit,
      province: params.province,
      city: params.city,
      content: params.content,
    } = payload);

    yield call(api.sendPromotionNotification, params);

    if (payload.onSuccess) {
      payload.onSuccess();
    }
  } catch (e) {
    logger.error('send promotion notification failed：', e);
    logger.error('code: ', e.code);

    if (payload.onFailure) {
      payload.onFailure(e.code);
    }
  }

  if (payload.onComplete) {
    payload.onComplete();
  }
}

// --- reducer

const initialState = new NotificationState();

export const reducer = (state=initialState, action) => {
  switch (action.type) {
    case UPDATE_STEP:
      return reduceUpdateStep(state, action);
    case UPDATE_SENDING:
      return reduceUpdateSending(state, action);
    default:
      return state;
  }
};

function reduceUpdateStep(state, action) {
  const {curStep} = action.payload;
  console.log('reduceUpdateStep: ', action.payload);
  return state.withMutations((m) => {
    m.set('curStep', curStep);
  })
}

function reduceUpdateSending(state, action) {
  const {sending} = action.payload;

  return state.withMutations((m) => {
    m.set('sending', sending);
  });
}

// --- selector

export const selector = {
  selectCurStep,
  selectSending,
};

function selectCurStep(appState) {
  const state = appState.NOTIFICATION;
  return state.get('curStep', 1);
}

function selectSending(appState) {
  const state = appState.NOTIFICATION;
  return state.get('sending', false);
}
