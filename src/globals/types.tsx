export type User = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  _id: { $oid: string };
  profilePicture: string;
  courses: string[];
  activeCourses: string[];
  blockedUsers: string[];
  creationDate: { $date: string };
};

export type Course = {
  _id: { $oid: string };
  name: string;
  description: string;
  creationDate: { $date: string };
  department: string;
  owner: string;
  rooms: [string, {$oid: string}][]
  modRoom: Room
  userThread: UserThread
  instructor: string | null;
  memberCount: number;
  semester: string;
};

export type Profile = {
  username: string;
  _id: { $oid: string };
  bio: string;
  modThreads: string[];
  profilePicture: any;
  blockedUsers: string[];
  creationDate: { $date: string };
  displayName: string;
  notificationPreference: [
    { courseName: string; messages: boolean; appeals: boolean; reports: boolean }
  ];
};

export type CourseManagement = {
  _id: { $oid: string };
  courseId: { $oid: string };
  rules: string[];
  bannedUsers: [{ username: string; reason: string }];
  warnedUsers: [{ username: string; reason: string }];
  appeals: [
    {
      username: string;
      response: string;
      reason: string;
      reviewed: boolean;
      unban: boolean;
    }
  ];
  requests: string[];
  moderators: string[];
  announcement: string[];
  reports: [{ username: string; reason: string }];
};

export type Room = {
  _id: { $oid: string };
  name: string;
  courseId: { $oid: string };
  connected: [{ username: string; sid: string; profilePic: string }];
  messages: Message[];
};

export type UserThread = {
  _id: { $oid: string };
  courseId: { $oid: string };
  name: string;
  numberOfPosts: number;
};

export type Message = {
  username: string;
  message: string;
  timeSent: string;
  profilePic: string;
  replyIndex?: number;
  replyID?: string;//unused? maybe delete this?
  reactions?: [{ username: string; reaction: string }];
};