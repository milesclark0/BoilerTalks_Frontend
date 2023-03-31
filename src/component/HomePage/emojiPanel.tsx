import EmojiPicker, {
  Theme,
  EmojiClickData,
  Emoji,
  EmojiStyle,
} from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import useSockets from "../../hooks/useSockets";
import { Room } from "../../types/types";

export const EmojiPanel = ({ message, room, index, addReaction }: any) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string>("");

  useEffect(() => {
    const updateMessage = async () => {
      await addReaction(message, room, false, selectedEmojis, index);
    };

    updateMessage();
  }, [selectedEmojis]);

  // const res = await axiosPrivate.post(addEmojiURL + message + selectedEmojis);
  // console.log(res);
  // if (res.status == 200) {
  //   if (res.data.statusCode == 200) {
  //     setAppeals(res.data.data.appeals);
  //   }
  // }

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
