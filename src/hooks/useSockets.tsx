import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../context/context";
import { Message, Room } from "../types/types";

let endpoint = "http://127.0.0.1:5000/chat";
const namespace = {
  connect: "connect",
  disconnect: "disconnect",
  message: "send_message",
  join: "join",
  leave: "leave",
  react: "react",
};

const useSockets = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (socket === null) {
      setSocket(io(endpoint));
    } else {
      socket.on(namespace.connect, () => {
        console.log("connected");
        setIsConnected(true);
      });

      // listens for disconnect event
      socket.on(namespace.disconnect, () => {
        console.log("disconnected");
        setIsConnected(false);
      });

      socket.on(
        namespace.react,
        (data: {
          index: number;
          reaction: string;
          message: Message;
          username: string;
        }) => {
          let index = data["index"];
          let reaction = data["reaction"];
          let message = data["message"];
          let username = data["username"];
          setMessages((messages) => {
            let newMessages = [...messages];
            // newMessages[index].reactions = [
            //   ...newMessages[index].reactions,
            //   { username, reaction },
            // ];
            newMessages[index].reactions
              ? newMessages[index].reactions.push({ username, reaction })
              : (newMessages[index].reactions = [{ username, reaction }]);
            return newMessages;
          });
        }
      );

      // listen for message
      socket.on(namespace.message, (msg: Message) => {
        console.log("got msg: ", msg);
        setMessages((messages) => {
          console.log("messages: ", messages);
          return [...messages, msg];
        });
      });
    }

    return () => {
      socket?.off(namespace.connect);
      socket?.off(namespace.disconnect);
      socket?.off(namespace.message);
    };
  }, [socket]);

  // sends a message to the server to be broadcasted to all users in the room
  const sendMessage = (
    message: Message,
    room: Room,
    isSystemMessage: boolean
  ) => {
    //TODO: send profile picture with message
    if (socket !== null) {
      if (message.message.trim() !== "") {
        if (!isSystemMessage) {
          console.log(`[${user?.username}]: ${room?._id.$oid}`);

          socket.emit(namespace.message, {
            message,
            roomID: room?._id.$oid,
            username: user?.username,
          });
        } else {
          message.message = `---${message.message}---`;
          socket.emit(namespace.message, {
            message,
            roomID: room?._id.$oid,
            username: user?.username,
          });
        }
      } else {
        alert("Please enter a message");
      }
    }
  };

  //used currently to add emoji reactions onto messages
  const addReaction = (
    message: Message,
    room: Room,
    isSystemMessage: boolean,
    reaction: string,
    index: number
  ) => {
    if (socket !== null) {
      if (message.message.trim() !== "") {
        if (!isSystemMessage) {
          console.log(`[${user?.username}]: ${room?._id.$oid} ${reaction}`);
          socket.emit(namespace.react, {
            message,
            roomID: room?._id.$oid,
            username: user?.username,
            reaction,
            index,
          });
        } else {
          message.message = `---${message.message}---${reaction}---`;
          socket.emit(namespace.react, {
            message,
            roomID: room?._id.$oid,
            username: user?.username,
            reaction,
            index,
          });
        }
      } else {
        alert("Please react with an emoji");
      }
    }
  };

  const connectToRoom = async (room: Room) => {
    if (socket !== null) {
      //console.log(room.name);
      let ret;
      if (room !== null) {
        ret = await new Promise((resolve) =>
          socket.emit(
            namespace.join,
            {
              roomID: room?._id.$oid,
              username: user?.username,
              profilePic: user?.profilePicture,
            },
            (response: string | Room) => resolve(response)
          )
        );
      }
      return ret;
    } else {
      console.log("socket is null");
    }
  };

  const disconnectFromRoom = (room: Room) => {
    if (socket !== null) {
      if (room !== null) {
        socket.emit(
          namespace.leave,
          { roomID: room?._id.$oid, username: user?.username },
          (response: string) => {
            //console.log(response);
          }
        );
      } else {
        //console.log("no room to leave");
      }
    }
  };

  return {
    messages,
    setMessages,
    sendMessage,
    addReaction,
    connectToRoom,
    disconnectFromRoom,
    socket,
    isConnected,
  };
};

export default useSockets;
