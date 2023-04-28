import { create } from 'zustand';
import { initialState, IState } from './initialState';
import { Course, Message, Question, Room } from '../globals/types';
import useSockets from '../hooks/useSockets';
import { Socket } from 'socket.io-client';

const useStore = create<IState>((set, get) => ({
    ...initialState,
    //local
    setActiveIcon: (course: string, isActiveCourse: boolean) => set({ activeIcon: { course, isActiveCourse } }),
    setCurrentCourse: (course: Course) => set({ currentCourse: course }),

    setCurrentRoom: (room: Room) => set({ currentRoom: room }),
    updateCurrentRoom: (message: Message) => set({ currentRoom: { ...get().currentRoom, messages: [...get().currentRoom.messages, message] } }),

    setDistinctDepartments: (departments: string[]) => set({ distinctDepartments: departments.sort((a, b) => a.localeCompare(b)) }),
    updateDistinctDepartments: (department: string | string[], action: "add" | "remove") => {
        if (action === "add") {
            if (Array.isArray(department)) {
                set({ distinctDepartments: Array.from(new Set([...get().distinctDepartments, ...department])).sort((a, b) => a.localeCompare(b)) });
            } else {
                set({ distinctDepartments: Array.from(new Set([...get().distinctDepartments, department])).sort((a, b) => a.localeCompare(b)) });
            }
        } else {
            if (Array.isArray(department)) {
                set({ distinctDepartments: Array.from(new Set(get().distinctDepartments.filter(d => !department.includes(d)))).sort((a, b) => a.localeCompare(b)) });
            } else {
                set({ distinctDepartments: Array.from(new Set(get().distinctDepartments.filter(d => d !== department))).sort((a, b) => a.localeCompare(b)) });
            }
        }
    },

    setDistinctCoursesByDepartment: (courses: Course[]) => set({ distinctCoursesByDepartment: courses }),
    updateDistinctCoursesByDepartment: (course: Course, action: "add" | "remove") => {
        if (action === "add") {
            set({ distinctCoursesByDepartment: Array.from(new Set([...get().distinctCoursesByDepartment, course])).sort((a, b) => a.name.localeCompare(b.name)) });
        } else {
            set({ distinctCoursesByDepartment: Array.from(new Set(get().distinctCoursesByDepartment.filter(c => c._id.$oid !== course._id.$oid))).sort((a, b) => a.name.localeCompare(b.name)) });
        }
    },
    setActiveCourseThread: (thread: string) => set({ activeCourseThread: thread }),

    //query filled
    setCourseUsers: (users: { username: string, profilePic: string }[]) => set({ courseUsers: users }),

    setUserCourseList: (courses: Course[]) => set({ userCourseList: courses }),
    updateUserCourseList: (course: Course | Course[], action: "add" | "remove") => {
        if (action === "add") {
            if (Array.isArray(course)) {
                set({ userCourseList: [...get().userCourseList, ...course].sort((a, b) => a.name.localeCompare(b.name)) });
            } else {
                set({ userCourseList: [...get().userCourseList, course].sort((a, b) => a.name.localeCompare(b.name)) });
            }
        } else {
            if (Array.isArray(course)) {
                set({ userCourseList: get().userCourseList.filter(c => !course.map(c => c._id.$oid).includes(c._id.$oid)).sort((a, b) => a.name.localeCompare(b.name)) });
            } else {
                set({ userCourseList: get().userCourseList.filter(c => c._id.$oid !== course._id.$oid).sort((a, b) => a.name.localeCompare(b.name)) });
            }
        }
    },

    setUserRoomsList: (rooms: Room[]) => set({ userRoomsList: rooms }),
    addUserRoom: (room: Room) => set({ userRoomsList: [...get().userRoomsList, room].sort((a, b) => a.name.localeCompare(b.name)) }),
    updateRoomMessages: (room: Room, message: Message) => {
        const rooms = get().userRoomsList;
        const index = rooms.findIndex(r => r._id.$oid === room._id.$oid);
        rooms[index].messages.push(message);
        set({ userRoomsList: rooms });
    },

    //sockets
    setSocket: (socket: Socket) => set({ socket }),
    setMessage: (message: string) => set({ message }),
    setMessages: (messages: Message[]) => set({ messages }),
    addMessage: (message: Message) => set({ messages: [...get().messages, message] }),
    deleteMessage(message: Message) {
        const messages = get().messages;
        const index = messages.findIndex(m => m.timeSent === message.timeSent && m.username === message.username);
        messages.splice(index, 1);
        set({ messages });
    },
    addReactionMessage: ( data: any) => {
        let index = data["index"];
        let reaction = data["reaction"];
        let username = data["username"];
        let displayName = data["displayName"];
        let newMessages = [...get().messages];
          newMessages[index].reactions
            ? newMessages[index].reactions.push({ username, reaction })
            : (newMessages[index].reactions = [{ username, reaction }]);
        set({ messages: newMessages });
    },
    setJoinedRoom: (room: Room) => set({ joinedRoom: room }),


    setQuestions: (questions: Question[]) => set({ questions }),
}));

export default useStore;

