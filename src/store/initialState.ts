import { Socket } from "socket.io-client";
import { Course, Message, Room } from "../globals/types";
import useSockets from "../hooks/useSockets";

export interface IState {
    activeIcon: { course: string, isActiveCourse: boolean },
    setActiveIcon: (course: string, isActiveCourse: boolean) => void,

    currentCourse: Course | null,
    setCurrentCourse: (course: Course) => void,

    currentRoom: Room | null,
    setCurrentRoom: (room: Room) => void,
    updateCurrentRoom: (message: Message) => void,

    distinctDepartments: string[],
    setDistinctDepartments: (departments: string[]) => void,
    updateDistinctDepartments: (department: string | string[], action: "add" | "remove") => void,

    distinctCoursesByDepartment: Course[],
    setDistinctCoursesByDepartment: (courses: Course[]) => void,
    updateDistinctCoursesByDepartment: (course: Course, action: "add" | "remove") => void,

    activeCourseThread: string,
    setActiveCourseThread: (thread: string) => void,

    courseUsers: { username: string, profilePic: string }[],
    setCourseUsers: (users: { username: string, profilePic: string }[]) => void,

    userCourseList: Course[],
    setUserCourseList: (courses: Course[]) => void,
    updateUserCourseList: (course: Course | Course[], action: "add" | "remove") => void,

    userRoomsList: Room[],
    setUserRoomsList: (rooms: Room[]) => void,
    addUserRoom: (room: Room) => void,
    updateRoomMessages: (room: Room, message: Message) => void,

    //sockets
    message: string,
    setMessage: (message: string) => void,
    messages: Message[],
    setMessages: (messages: Message[]) => void,
    addMessage: (message: Message) => void,
    deleteMessage: (message: Message) => void,
    addReactionMessage: (data: any) => void,

    socket: Socket | null,
    setSocket: (socket: Socket) => void,


    joinedRoom: Room | null,
    setJoinedRoom: (room: Room) => void,


}


export const initialState: IState = {
    activeIcon: { course: "", isActiveCourse: false },
    setActiveIcon: (course: string, isActiveCourse: boolean) => { },

    currentCourse: null,
    setCurrentCourse: (course: Course) => { },

    currentRoom: null,
    setCurrentRoom: (room: Room) => { },
    updateCurrentRoom: (message: Message) => { },

    distinctDepartments: [],
    setDistinctDepartments: (departments: string[]) => { },
    updateDistinctDepartments: (department: string, action: "add" | "remove") => { },

    distinctCoursesByDepartment: [],
    setDistinctCoursesByDepartment: (courses: Course[]) => { },
    updateDistinctCoursesByDepartment: (course: Course, action: "add" | "remove") => { },

    activeCourseThread: "",
    setActiveCourseThread: (thread: string) => { },

    courseUsers: [],
    setCourseUsers: (users: { username: string, profilePic: string }[]) => { },

    userCourseList: [],
    setUserCourseList: (courses: Course[]) => { },
    updateUserCourseList: (course: Course | Course[], action: "add" | "remove") => { },

    userRoomsList: [],
    setUserRoomsList: (rooms: Room[]) => { },
    addUserRoom: (room: Room) => { },
    updateRoomMessages: (room: Room, message: Message) => { },

    //sockets
    message: "",
    setMessage: (message: string) => { },
    messages: [],
    setMessages: (messages: Message[]) => { },
    addMessage: (message: Message) => { },
    deleteMessage: (message: Message) => { },
    addReactionMessage: (data: any) => { },

    socket: null,
    setSocket: (socket: Socket) => { },


    joinedRoom: null,
    setJoinedRoom: (room: Room) => { },




}