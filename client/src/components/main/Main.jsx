import React, { useEffect, useState, useRef } from "react";
import "./_main.scss";
import { BsSearch } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import FriendList from "../friendList/FriendList";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import {
  getFriends,
  getMess,
  ImageSend,
  sendMessage,
  seenMessage,
  updateMessage,
} from "../../store/action/messagerAction";
import { userLogout } from "../../store/action/authAction";
import Chat from "../chat/Chat";
import useSound from "use-sound";
import notificationSound from "../../audio/notification.mp3";
import sendingSound from "../../audio/sending.mp3";

const Main = () => {
  const scrollRef = useRef();

  const socket = useRef();

  const [notificationS] = useSound(notificationSound);

  const [sendS] = useSound(sendingSound);

  const [activeUser, setActiveUser] = useState([]);

  const {
    friends,
    message,
    messageSendSuccess,
    messageGetSuccess,
    new_user_add,
  } = useSelector((state) => state.messenger);

  const { myInfo } = useSelector((state) => state.auth);

  const [currentFriend, setCurrentFriend] = useState("");

  const [newMessenger, setNewMessenger] = useState("");

  const [socketMessage, setSocketMessage] = useState("");

  const [typingMess, setTypingMess] = useState("");

  const dispatch = useDispatch();

  const sendMess = (e) => {
    e.preventDefault();

    sendS();

    const data = {
      senderName: myInfo.userName,
      reseverId: currentFriend._id,
      message: newMessenger ? newMessenger : "🧡",
    };

    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      reseverId: currentFriend._id,
      msg: "",
    });

    dispatch(sendMessage(data));
    setNewMessenger("");
  };

  const emojiSend = (emo) => {
    setNewMessenger(`${newMessenger}` + emo);
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      reseverId: currentFriend._id,
      msg: emo,
    });
  };

  const imageSend = (e) => {
    if (e.target.files.length !== 0) {
      sendS();

      const formData = new FormData();

      formData.append("senderName", myInfo.userName);
      formData.append("reseverId", currentFriend._id);
      formData.append("image", e.target.files[0]);

      dispatch(ImageSend(formData));
    }
  };

  const inputHandle = (e) => {
    setNewMessenger(e.target.value);

    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      reseverId: currentFriend._id,
      msg: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(getFriends());
    dispatch({ type: "NEW_USER_ADD_CLEAR" });
  }, [dispatch, new_user_add]);

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      setSocketMessage(data);
    });

    socket.current.on("typingMessageGet", (data) => {
      setTypingMess(data);
    });
    socket.current.on("msgSeenResponse", (msg) => {
      dispatch({
        type: "SEEN_MESSAGE",
        payload: {
          msgInfo: msg,
        },
      });
      socket.current.on("msgDeliveredResponse", (msg) => {
        dispatch({
          type: "DELIVERED_MESSAGE",
          payload: {
            msgInfo: msg,
          },
        });
      });
      socket.current.on("seenSuccess", (data) => {
        dispatch({
          type: "SEEN_ALL",
          payload: data,
        });
      });
    });
  }, [dispatch]);

  useEffect(() => {
    socket.current.emit("addUser", myInfo.id, myInfo);
  }, [myInfo]);

  useEffect(() => {
    socket.current.on("getUser", (users) => {
      const filterUser = users.filter((u) => u.userId !== myInfo.id);
      setActiveUser(filterUser);
    });
    socket.current.on("new_user_add", (data) => {
      dispatch({
        type: "NEW_USER_ADD",
        payload: {
          new_user_add: data,
        },
      });
    });
  }, [dispatch, myInfo.id]);

  useEffect(() => {
    if (messageSendSuccess) {
      socket.current.emit("sendMessage", message[message.length - 1]);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          msgInfo: message[message.length - 1],
        },
      });
      dispatch({
        type: "MESSAGE_SEND_SUCCESS_CLEAR",
      });
    }
  }, [dispatch, message, messageSendSuccess]);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage.senderId === currentFriend._id &&
        socketMessage.reseverId === myInfo.id
      ) {
        dispatch({
          type: "SOCKET_MESSAGE",
          payload: {
            message: socketMessage,
          },
        });

        dispatch(seenMessage(socketMessage));
        socket.current.emit("messageSeen", socketMessage);
        dispatch({
          type: "UPDATE_FRIEND_MESSAGE",
          payload: {
            msgInfo: socketMessage,
            status: "seen",
          },
        });
      }
    }

    setSocketMessage("");
  }, [currentFriend, dispatch, myInfo.id, myInfo.is, socketMessage]);

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage.senderId !== currentFriend._id &&
      socketMessage.reseverId === myInfo.id
    ) {
      notificationS();
      toast.success(`${socketMessage.senderName} send a new message`);

      dispatch(updateMessage(socketMessage));
      socket.current.emit("deliveredMessage", socketMessage);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          msgInfo: socketMessage,
          status: "delivered",
        },
      });
    }
  }, [currentFriend._id, dispatch, myInfo.id, notificationS, socketMessage]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCurrentFriend(friends[0].fndInfo);
    }
  }, [friends]);

  useEffect(() => {
    dispatch(getMess(currentFriend._id));
  }, [currentFriend._id, dispatch]);

  useEffect(() => {
    if (message.length > 0) {
      if (message[message.length - 1].senderId !== myInfo.id) {
        dispatch({
          type: "UPDATE",
          payload: {
            id: currentFriend._id,
          },
        });
        socket.current.emit("seen", {
          senderId: currentFriend._id,
          reseverId: myInfo.id,
        });
        dispatch(seenMessage({ _id: message[message.length - 1]._id }));
      }
    }
    dispatch({
      type: "MESSAGE_GET_SUCCESS_CLEAR",
    });
  }, [currentFriend._id, dispatch, message, myInfo.id, messageGetSuccess]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const logout = () => {
    dispatch(userLogout());
    socket.current.emit("logout", myInfo.id);
  };

  const search = (e) => {
    const getFriendClass = document.getElementsByClassName("hoverFriend");
    const friendNameClass = document.getElementsByClassName("friendNames");

    for (
      var i = 0;
      i < getFriendClass.length, i < friendNameClass.length;
      i++
    ) {
      let text = friendNameClass[i].innerText.toLowerCase();

      if (text.indexOf(e.target.value.toLowerCase()) > -1) {
        getFriendClass[i].style.display = "";
      } else {
        getFriendClass[i].style.display = "none";
      }
    }
  };

  return (
    <div className="container">
      <Toaster
        position={"top-right"}
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: " 13px",
          },
        }}
      />
      <div className="sidebarWrapper">
        <div className="top">
          <div className="imageName">
            <div className="image">
              <img src={myInfo.image} alt="" />
            </div>
            <div className="name">
              <h3>{myInfo.userName}</h3>
            </div>
          </div>
          <div className="icons">
            <div className="icon" onClick={logout}>
              <FiLogOut />
            </div>
          </div>
        </div>
        <hr className="sidebarHr" />
        <div className="search">
          <button>
            <BsSearch />
          </button>
          <input
            type="text"
            placeholder="search"
            className="form-control"
            onChange={search}
          />
        </div>
        <div className="list">
          <div className="activeFriends"></div>
          <div className="friendList">
            {friends && friends.length > 0
              ? friends.map((f, index) => (
                  <div
                    onClick={() => setCurrentFriend(f.fndInfo)}
                    key={index}
                    className={
                      currentFriend._id === f.fndInfo._id
                        ? "hoverFriend active"
                        : "hoverFriend"
                    }
                  >
                    <FriendList
                      activeUser={activeUser}
                      myId={myInfo.id}
                      friend={f}
                    />
                  </div>
                ))
              : "no friend"}
          </div>
        </div>
      </div>

      {currentFriend ? (
        <div className="chatWrapper">
          <Chat
            currentFriend={currentFriend}
            inputHandle={inputHandle}
            newMessenger={newMessenger}
            sendMess={sendMess}
            message={message}
            scrollRef={scrollRef}
            emojiSend={emojiSend}
            imageSend={imageSend}
            activeUser={activeUser}
            typingMess={typingMess}
          />
        </div>
      ) : (
        "Please chat with your friend"
      )}
    </div>
  );
};

export default Main;
