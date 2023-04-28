import { useState } from "react";
import { useAuth } from "../context/context";
import { Message, Room } from "../globals/types";
import useStore from "../store/store";

const useSocketFunctions = () => {
    const namespace = {
        connect: "connect",
        disconnect: "disconnect",
        message: "send_message",
        delete_message: "delete_message",
        edit_message: "edit_message",
        join: "join",
        leave: "leave",
        react: "react",
    };
    const { user, profile } = useAuth();
    const socket = useStore(state => state.socket);
    const [joinedRoom, setJoinedRoom] = useStore(state => [state.joinedRoom, state.setJoinedRoom]);
    // sends a message to the server to be broadcasted to all users in the room
    const sendMessage = async (message: Message, room: Room, isSystemMessage: boolean) => {
        if (joinedRoom === null) {
            await connectToRoom(room);
        }
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

    const editMessage = async (message: Message, room: Room, index: number) => {
        if (joinedRoom === null) {
            await connectToRoom(room);
        }
        if (message.message.trim() !== "") {
                console.log("editing message", message.message.trim(), "to room", room?.name);

                socket.emit(namespace.edit_message, {
                    message,
                    roomID: room?._id.$oid,
                    index,
                });
        } else {
            alert("Please enter a message");
        }   
    };

    // used to delete a message from the server
    const deleteMessage = (message: Message, room: Room) => {
        if (socket.connected) {
            console.log("deleting message", message.message.trim(), "from room", room?.name);
            socket.emit(namespace.delete_message, {
                message,
                roomID: room?._id.$oid,
            });
        } else {
            console.log("socket not connected for deletion");

        }

    };

    //used currently to add emoji reactions onto messages
    const addReaction = (message: Message, room: Room, isSystemMessage: boolean, reaction: string, index: number) => {
        if (socket.connected) {
            if (message.message.trim() !== "") {
                if (!isSystemMessage) {
                    console.log(`[${user?.username}]: ${room?._id.$oid} ${reaction}`);
                    socket.emit(namespace.react, {
                        message,
                        roomID: room?._id.$oid,
                        username: user?.username,
                        reaction,
                        index,
                        displayName : profile?.displayName,
                    });
                } else {
                    message.message = `---${message.message}---${reaction}---`;
                    socket.emit(namespace.react, {
                        message,
                        roomID: room?._id.$oid,
                        username: user?.username,
                        reaction,
                        index,
                        displayName : profile?.displayName,
                    });
                }
            } else {
                alert("Please react with an emoji");
            }
        }
    };

    const connectToRoom = async (room: Room) => {
        if (joinedRoom?._id.$oid === room._id.$oid) {
            return;
        }
        if (socket.connected) {
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
                            displayName: profile?.displayName,
                        },
                        (response) => {
                            console.log(response.data.message)
                            resolve(response)
                        }
                    )
                );
                setJoinedRoom(room);
            }
            return ret;
        } else {
            console.log("socket is not connected");
        }
    };

    const disconnectFromRoom = (room: Room) => {
        if (socket.connected) {
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
        editMessage,
        addReaction,
        connectToRoom,
        disconnectFromRoom,
        deleteMessage,
    };
};
export default useSocketFunctions;