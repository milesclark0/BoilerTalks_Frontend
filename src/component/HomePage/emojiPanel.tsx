import EmojiPicker, { Theme, EmojiClickData, Emoji, EmojiStyle } from "emoji-picker-react";
import React, { useState } from "react";

export const EmojiPanel = () => {
  const [selectedEmojis, setSelectedEmojis] = useState<string>("");
    return (
      <div>
        <div>
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emojiData: EmojiClickData) => {
              setSelectedEmojis(emojiData.unified);
              console.log(selectedEmojis);
            }}
          />
        </div>
        <div className="show-emoji">
          Your selected Emoji is:
          {selectedEmojis ? <Emoji unified={selectedEmojis} emojiStyle={EmojiStyle.APPLE} size={22} /> : null}
        </div>
      </div>
    );
};
