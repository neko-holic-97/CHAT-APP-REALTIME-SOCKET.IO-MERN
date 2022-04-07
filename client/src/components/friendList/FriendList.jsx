import React from "react";
import "./_friendList.scss";
import moment from "moment";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { HiOutlineCheckCircle } from "react-icons/hi";

const FriendList = (props) => {
  const { fndInfo, msgInfo } = props.friend;
  const myId = props.myId;
  const { activeUser } = props;
  return (
    <div className="friends">
      <div className="friendAvatar">
        <div className="image">
          <img src={fndInfo.image} alt="" />
          {activeUser &&
          activeUser.length > 0 &&
          activeUser.some((u) => u.userId === fndInfo._id) ? (
            <div className="activeIcon"></div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="friendName_Seen">
        <div className="friendName">
          <h4 className={"friendNames"}>{fndInfo.userName}</h4>

          <div className="msgTime">
            {msgInfo && msgInfo.senderId === myId ? (
              <span>You </span>
            ) : (
              <span>{fndInfo.userName} </span>
            )}
            {msgInfo && msgInfo.message.text ? (
              <span>{msgInfo.message.text.slice(0, 10)} </span>
            ) : msgInfo && msgInfo.message.image ? (
              <span> send a image </span>
            ) : (
              <span> connect you </span>
            )}
            <span>
              {msgInfo
                ? moment(msgInfo.createdAt).startOf("mini").fromNow()
                : moment(fndInfo.createdAt).startOf("mini").fromNow()}
            </span>
          </div>
        </div>

        {myId === msgInfo?.senderId ? (
          <div className="seenUnseenIcon">
            {msgInfo.status === "seen" ? (
              <img src={fndInfo.image} alt="" />
            ) : msgInfo.status === "delivered" ? (
              <div className="delivered">
                <RiCheckboxCircleFill />
              </div>
            ) : (
              <div className="unseen">
                <HiOutlineCheckCircle />
              </div>
            )}
          </div>
        ) : (
          <div className="seenUnseenIcon">
            {msgInfo?.status !== undefined && msgInfo?.status !== "seen" ? (
              <div className="seenIcon"></div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
