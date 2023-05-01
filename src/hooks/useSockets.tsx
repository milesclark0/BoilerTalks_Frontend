import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "context/context";
import { Message, Room } from "globals/types";
import useStore from "store/store";

let endpoint = "http://127.0.0.1:5000/chat";
const namespace = {
  connect: "connect",
  disconnect: "disconnect",
  message: "send_message",
  delete_message: "delete_message",
  join: "join",
  leave: "leave",
  react: "react",
};

const useSockets = () => {
  const [socket, setSocket, addMessage, deleteMessage, addReactionMessage] = useStore((state) => [
    state.socket,
    state.setSocket,
    state.addMessage,
    state.deleteMessage,
    state.addReactionMessage,
  ]);

  useEffect(() => {
    if (socket === null || socket.connected === false) {
      setSocket(io(endpoint));
    }
  }, []);

  useEffect(() => {
    if (socket === null) return;
    socket.on(namespace.connect, () => {
      console.log("connected");
    });

    // listens for disconnect event
    socket.on(namespace.disconnect, () => {
      console.log("disconnected");
    });

    socket.on(namespace.react, (data: { index: number; reaction: string; message: Message; username: string; displayName: string }) => {
      addReactionMessage(data);
    });

    // listen for message
    socket.on(namespace.message, (msg: Message) => {
      console.log("got msg: ", msg);
      addMessage(msg);
    });

    socket.on(namespace.delete_message, (msg: Message) => {
      console.log("got msg to delete: ", msg);
      deleteMessage(msg);
    });

    return () => {
      socket?.off(namespace.connect);
      socket?.off(namespace.disconnect);
      socket?.off(namespace.message);
      socket?.off(namespace.react);
      console.log("unmounting");

      socket?.disconnect();
    };
  }, [socket]);
};

export default useSockets;
