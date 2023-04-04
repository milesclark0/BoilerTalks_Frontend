import { useState } from "react";
import { useAuth } from "../context/context";
import { Message, Room } from "../globals/types";
import useStore from "../store/store";

const useSocketFunctions = () => {
    const namespace = {
        connect: "connect",
        disconnect: "disconnect",
        message: "send_message",
        join: "join",
        leave: "leave",
        react: "react",
    };
    const {user} = useAuth();
    const socket = useStore(state => state.socket);
    const [joinedRoom, setJoinedRoom] = useStore(state => [state.joinedRoom, state.setJoinedRoom]);
    // sends a message to the server to be broadcasted to all users in the room
    const sendMessage = (message: Message, room: Room, isSystemMessage: boolean) => {
        //TODO: send profile picture with message
        if (socket !== null) {
            if (message.message.trim() !== "") {
                if (!isSystemMessage) {
                    console.log("sending message", message.message.trim(), "to room", room?.name);

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
    const addReaction = (message: Message, room: Room, isSystemMessage: boolean, reaction: string, index: number) => {
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
        console.log(joinedRoom?._id.$oid, room._id.$oid);
        
        if (joinedRoom?._id.$oid === room._id.$oid) {
            return;
        }
        if (socket !== null) {
            console.log(room.name);
            let ret;
            if (room !== null) {
                console.log("connecting to room", room?.name);
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
                setJoinedRoom(room);
            }
            return ret;
        } else {
            console.log("socket is null");
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

    return {
        sendMessage,
        addReaction,
        connectToRoom,
        disconnectFromRoom,
    };
};
export default useSocketFunctions;