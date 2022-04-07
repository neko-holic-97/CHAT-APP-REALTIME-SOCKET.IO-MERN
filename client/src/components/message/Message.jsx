import "./_message.scss";
import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ message, currentFriend, scrollRef, typingMess }) => {
  const { myInfo } = useSelector((state) => state.auth);

  return (
    <div className="messageWrapper">
      <div className="messenger">
        {message && message.length > 0 ? (
          message.map((m, index) =>
            m.senderId === myInfo.id ? (
              <div key={index} ref={scrollRef} className="send">
                <div className="sendWrapper">
                  <div className="text">
                    <p>
                      {m.message.text === "" ? (
                        <img src={m.message.image} alt="image" />
                      ) : (
                        m.message.text
                      )}
                    </p>
                  </div>
                  <span className="time">
                    {moment(m.createdAt).startOf("mini").fromNow()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="reply" key={index} ref={scrollRef}>
                <div className="avatar">
                  <img src={currentFriend.image} alt="" />
                </div>
                <div className="content">
                  <div className="text">
                    <p>
                      {m.message.text === "" ? (
                        <img src={m.message.image} alt="image" />
                      ) : (
                        m.message.text
                      )}
                    </p>
                  </div>
                  <span className="time">
                    {moment(m.createdAt).startOf("mini").fromNow()}
                  </span>
                </div>
              </div>
            )
          )
        ) : (
          <div className="friendConnect">
            <img src={currentFriend.image} alt="" />
            <div className="text">
              <h3>{currentFriend.userName} </h3>
              <p>connect you</p>
            </div>
            <span>
              {moment(currentFriend.createdAt).startOf("mini").fromNow()}
            </span>
          </div>
        )}
      </div>
      {typingMess &&
      typingMess.msg &&
      typingMess.senderId === currentFriend._id ? (
        <div className="typing-mess">
          <div className="reply">
            <div className="avatar">
              <img src={currentFriend.image} alt="" />
            </div>
            <div className="content">
              <div className="text">
                <p>Typing message........</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Message;
