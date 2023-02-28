import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../context/context";
import { Message, Room } from "../types/types";

let endpoint = "http://127.0.0.1:5000/chat";
const namespace = { connect: "connect", disconnect: "disconnect", message: "send_message", join: "join", leave: "leave" };


const useSockets = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (socket === null) {
      setSocket(io(endpoint));
    } else {
      socket.on(namespace.connect, () => {
        console.log("connected");
      });

      // listens for disconnect event
      socket.on(namespace.disconnect, () => {
        console.log("disconnected");
      });

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
  const sendMessage = (message: { username: string; message: string; timeSent: string }, room: Room, isSystemMessage: boolean) => {
    //TODO: send profile picture with message
    if (socket !== null) {
      if (message.message.trim() !== "") {
        if (!isSystemMessage) {
          console.log(`[${user?.username}]: ${room?._id.$oid}`);

          socket.emit(namespace.message, { message, roomID: room?._id.$oid, username: user?.username });
        } else {
          message.message = `---${message.message}---`;
          socket.emit(namespace.message, { message, roomID: room?._id.$oid, username: user?.username });
        }
      } else {
        alert("Please enter a message");
      }
    }
  };

  const connectToRoom = async (room: Room) => {
    if (socket !== null) {
      //console.log(room.name);
      let ret;
      if (room !== null) {
        ret = await new Promise((resolve) =>
          socket.emit(namespace.join, { roomID: room?._id.$oid, username: user?.username }, (response: string | Room) => resolve(response))
        );
      }
      return ret;
    }
  };

  const disconnectFromRoom = (room: Room) => {
    if (socket !== null) {
      if (room !== null) {
        socket.emit(namespace.leave, { roomID: room?._id.$oid, username: user?.username }, (response: string) => {
          //console.log(response);
        });
      } else {
        //console.log("no room to leave");
      }
    }
  };

  return { message, setMessage, messages, setMessages, sendMessage, connectToRoom, disconnectFromRoom };
};

export default useSockets;
