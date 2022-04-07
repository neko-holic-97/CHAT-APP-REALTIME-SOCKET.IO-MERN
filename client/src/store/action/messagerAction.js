import axios from "axios";
import {
  FRIENDS_GET_SUCCESS,
  MESSAGE_GET_SUCCESS,
  MESSAGE_SEND_SUCCESS,
} from "../types/messengerType";

export const getFriends = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/messenger/friends");
    dispatch({
      type: FRIENDS_GET_SUCCESS,
      payload: {
        friends: response.data.friends,
      },
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

export const sendMessage = (data) => async (dispatch) => {
  try {
    const response = await axios.post("/api/messenger/send", data);
    dispatch({
      type: MESSAGE_SEND_SUCCESS,
      payload: { message: response.data.message },
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

export const getMess = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/messenger/get-mess/${id}`);
      dispatch({
        type: MESSAGE_GET_SUCCESS,
        payload: {
          message: response.data.message,
        },
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };
};

export const ImageSend = (data) => async (dispatch) => {
  try {
    const response = await axios.post("/api/messenger/image-send", data);
    dispatch({
      type: MESSAGE_SEND_SUCCESS,
      payload: {
        message: response.data.message,
      },
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

export const seenMessage = (msg) => async (dispatch) => {
  try {
    const response = await axios.post("/api/messenger/seen-message", msg);
  } catch (error) {
    console.log(error.response.message);
  }
};

export const updateMessage = (msg) => async (dispatch) => {
  try {
    const response = await axios.post("/api/messenger/delivered-message", msg);
  } catch (error) {
    console.log(error.response.message);
  }
};
