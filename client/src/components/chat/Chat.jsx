import React from "react";
import "./_chat.scss";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import Message from "../message/Message";
import Footer from "../footer/Footer";
import Rightbar from "../rightbar/Rightbar";

const Chat = (props) => {
  const {
    currentFriend,
    inputHandle,
    newMessenger,
    sendMess,
    message,
    scrollRef,
    emojiSend,
    imageSend,
    activeUser,
    typingMess,
  } = props;

  return (
    <div className="main">
      <input type="checkbox" id="dot" />
      <div className="mainWrapper">
        <div className="header">
          <div className="imageName">
            <div className="image">
              <img src={currentFriend.image} alt="" />
              {activeUser &&
              activeUser.length > 0 &&
              activeUser.some((u) => u.userId === currentFriend._id) ? (
                <div className="sign"></div>
              ) : (
                ""
              )}
            </div>

            <div className="name">
              <h3>{currentFriend.userName}</h3>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <BsFillTelephoneFill />
            </div>
            <div className="icon">
              <FaVideo />
            </div>
            <div className="icon">
              <label htmlFor="dot">
                <HiDotsCircleHorizontal />
              </label>
            </div>
          </div>
        </div>

        <hr className="sidebarHr" />

        <div className="body">
          <div className="bodyMess">
            <Message
              message={message}
              currentFriend={currentFriend}
              scrollRef={scrollRef}
              typingMess={typingMess}
            />
          </div>
        </div>

        <div className="footer">
          <Footer
            sendMess={sendMess}
            inputHandle={inputHandle}
            newMessenger={newMessenger}
            emojiSend={emojiSend}
            imageSend={imageSend}
          />
        </div>
      </div>

      <div className="rightWrapper">
        <Rightbar
          currentFriend={currentFriend}
          activeUser={activeUser}
          message={message}
        />
      </div>
    </div>
  );
};

export default Chat;
