import React from "react";
import "./_activeFriends.scss";

const ActiveFriend = ({ user, setCurrentFriend }) => {
  return (
    <div
      onClick={() =>
        setCurrentFriend({
          _id: user.userInfo.id,
          email: user.userInfo.email,
          image: user.userInfo.image,
          userName: user.userInfo.userName,
        })
      }
      className="activeFriend"
    >
      <div className="infoActive">
        <div className="image">
          <img src={`./image/${user.userInfo.image}`} alt="" />
          <div className="sign"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFriend;
