import {
  FRIENDS_GET_SUCCESS,
  MESSAGE_GET_SUCCESS,
  MESSAGE_SEND_SUCCESS,
  MESSAGE_SEND_SUCCESS_CLEAR,
  UPDATE_FRIEND_MESSAGE,
  SEEN_MESSAGE,
  DELIVERED_MESSAGE,
  MESSAGE_GET_SUCCESS_CLEAR,
  UPDATE,
} from "../types/messengerType";

const messengerState = {
  friends: [],
  message: [],
  messageSendSuccess: false,
  messageGetSuccess: false,
  new_user_add: "",
};

export const messengerReducer = (state = messengerState, action) => {
  const { type, payload } = action;

  if (type === FRIENDS_GET_SUCCESS) {
    return {
      ...state,
      friends: payload.friends,
    };
  }

  if (type === MESSAGE_GET_SUCCESS) {
    return {
      ...state,
      messageGetSuccess: true,
      message: payload.message,
    };
  }

  if (type === MESSAGE_SEND_SUCCESS) {
    return {
      ...state,
      messageSendSuccess: true,
      message: [...state.message, payload.message],
    };
  }

  if (type === "SOCKET_MESSAGE") {
    return {
      ...state,
      message: [...state.message, payload.message],
    };
  }

  if (type === UPDATE_FRIEND_MESSAGE) {
    const index = state.friends.findIndex(
      (f) =>
        f.fndInfo._id === payload.msgInfo.reseverId ||
        f.fndInfo._id === payload.msgInfo.senderId
    );
    state.friends[index].msgInfo = payload.msgInfo;
    state.friends[index].msgInfo.status = payload.status;
    return state;
  }

  if (type === MESSAGE_SEND_SUCCESS_CLEAR) {
    return {
      ...state,
      messageSendSuccess: false,
    };
  }
  if (type === SEEN_MESSAGE) {
    const index = state.friends.findIndex(
      (f) =>
        f.fndInfo._id === payload.msgInfo.reseverId ||
        f.fndInfo._id === payload.msgInfo.senderId
    );
    state.friends[index].msgInfo.status = "seen";
    return { ...state };
  }
  if (type === DELIVERED_MESSAGE) {
    const index = state.friends.findIndex(
      (f) =>
        f.fndInfo._id === payload.msgInfo.reseverId ||
        f.fndInfo._id === payload.msgInfo.senderId
    );
    state.friends[index].msgInfo.status = "delivered";
    return {
      ...state,
    };
  }

  if (type === UPDATE) {
    const index = state.friends.findIndex((f) => f.fndInfo._id === payload.id);
    if (state.friends[index].msgInfo) {
      state.friends[index].msgInfo.status = "seen";
    }
    return {
      ...state,
    };
  }

  if (type === MESSAGE_GET_SUCCESS_CLEAR) {
    return {
      ...state,
      messageGetSuccess: false,
    };
  }
  if (type === "SEEN_ALL") {
    const index = state.friends.findIndex(
      (f) => f.fndInfo._id === payload.reseverId
    );
    state.friends[index].msgInfo.status = "seen";
    return {
      ...state,
    };
  }
  if (type === "LOGOUT_SUCCESS") {
    return {
      ...state,
      friends: [],
      message: [],
      messageSendSuccess: false,
      messageGetSuccess: false,
    };
  }
  if (type === "NEW_USER_ADD") {
    return {
      ...state,
      new_user_add: payload.new_user_add,
    };
  }
  if (type === "NEW_USER_ADD_CLEAR") {
    return {
      ...state,
      new_user_add: "",
    };
  }

  return state;
};
