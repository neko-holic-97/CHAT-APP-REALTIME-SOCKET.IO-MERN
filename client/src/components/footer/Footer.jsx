import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import "./_footer.scss";
import { RiGalleryLine } from "react-icons/ri";
import { BiMessageAltEdit } from "react-icons/bi";
import { AiFillGift } from "react-icons/ai";

const Footer = ({
  inputHandle,
  newMessenger,
  sendMess,
  emojiSend,
  imageSend,
}) => {
  const emojis = [
    "✌",
    "😂",
    "😝",
    "😁",
    "😱",
    "👉",
    "🙌",
    "🍻",
    "🔥",
    "🌈",
    "☀",
    "🎈",
    "🌹",
    "💄",
    "🎀",
    "⚽",
    "🎾",
    "🏁",
    "😡",
    "👿",
    "🐻",
    "🐶",
    "🐬",
    "🐟",
    "🍀",
    "👀",
    "🚗",
    "🍎",
    "💝",
    "💙",
    "👌",
    "❤",
    "😍",
    "😉",
    "😓",
    "😳",
    "💪",
    "💩",
    "🍸",
    "🔑",
    "💖",
    "🌟",
    "🎉",
    "🌺",
    "🎶",
    "👠",
    "🏈",
    "⚾",
    "🏆",
    "👽",
    "💀",
    "🐵",
    "🐮",
    "🐩",
    "🐎",
    "💣",
    "👃",
    "👂",
    "🍓",
    "💘",
    "💜",
    "👊",
    "💋",
    "😘",
    "😜",
    "😵",
    "🙏",
    "👋",
    "🚽",
    "💃",
    "💎",
    "🚀",
    "🌙",
    "🎁",
    "⛄",
    "🌊",
    "⛵",
    "🏀",
    "🎱",
    "💰",
    "👶",
    "👸",
    "🐰",
    "🐷",
    "🐍",
    "🐫",
    "🔫",
    "👄",
    "🚲",
    "🍉",
    "💛",
    "💚",
  ];

  return (
    <div className="footer">
      <input type="checkbox" id="emoji" />
      <div className="file hover">
        <div className="add">File</div>
        <BsPlusCircle />
      </div>
      <div className="file hover">
        <div className="add">Image</div>
        <input
          onChange={imageSend}
          type="file"
          id="pic"
          className="form-control"
        />
        <label htmlFor="pic">
          <RiGalleryLine />
        </label>
      </div>
      <div className="file">
        <BiMessageAltEdit />
      </div>
      <div className="file hover">
        <div className="add"> Gift</div>
        <AiFillGift />
      </div>
      <div className="messageType">
        <input
          onChange={inputHandle}
          value={newMessenger}
          type="text"
          name="message"
          id="message"
          placeholder="Aa"
          className="form-control"
        />
        <label htmlFor="emoji">😊</label>
      </div>
      <div onClick={sendMess} className="file">
        🧡
      </div>
      <div className="emojiSection">
        <div className="emoji">
          {emojis.map((e) => (
            <span key={e} onClick={() => emojiSend(e)}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
