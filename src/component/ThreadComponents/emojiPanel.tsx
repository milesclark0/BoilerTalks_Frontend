import EmojiPicker, {
  Theme,
  EmojiClickData,
  Emoji,
  EmojiStyle,
} from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import useSockets from "../../hooks/useSockets";
import { Room } from "../../globals/types";

export const EmojiPanel = ({ index, addReaction }: any) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string>("");

  useEffect(() => {
    const updateMessage = async () => {
      if (selectedEmojis !== "") {
        addReaction(selectedEmojis, index);
      }
    };

    updateMessage();
  }, [selectedEmojis]);

  return (
    <div>
      <div>
        <EmojiPicker
          theme={Theme.DARK}
          onEmojiClick={(emojiData: EmojiClickData) => {
            setSelectedEmojis(emojiData.unified);
            console.log(emojiData);
          }}
        />
      </div>
      <div className="show-emoji">
        {selectedEmojis ? (
          <Emoji
            unified={selectedEmojis}
            emojiStyle={EmojiStyle.APPLE}
            size={22}
          />
        ) : null}
      </div>
    </div>
  );
};
