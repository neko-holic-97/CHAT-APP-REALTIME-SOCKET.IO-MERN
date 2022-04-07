import React from "react";
import "./_rightbar.scss";
import { BsChevronDown } from "react-icons/bs";

const Rightbar = ({ currentFriend, activeUser, message }) => {
  return (
    <div className="rightbar">
      <div className="wrapper">
        <input type="checkbox" id="gallery" />
        <div className="userInfo">
          <div className="image">
            <img src={currentFriend.image} alt="" />
          </div>
          {activeUser &&
          activeUser.length > 0 &&
          activeUser.some((u) => u.userId === currentFriend._id) ? (
            <div className="activeUser">Active</div>
          ) : (
            ""
          )}

          <div className="name">
            <h4>{currentFriend.userName}</h4>
          </div>
        </div>
        <div className="others">
          <div className="customChat">
            <p>Custom Chat</p>
            <BsChevronDown className="icon" />
          </div>
          <div className="privacy">
            <p>Privacy and Support</p>
            <BsChevronDown className="icon" />
          </div>
          <div className="media">
            <p>Share media</p>
            <label htmlFor="gallery">
              <BsChevronDown className="icon" />
            </label>
          </div>
        </div>
        <div className="gallery">
          {message && message.length > 0
            ? message.map(
                (m, index) =>
                  m.message.image && (
                    <div className="image" key={index}>
                      <img src={m.message.image} alt="" />
                    </div>
                  )
              )
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
