export type User = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  _id: {$oid: string};
  profilePicture: string;
  courses: string[];
  activeCourses: string[];
  blockedUsers: string[];
  creationDate: {$date: string};
};

export type Course = {
  _id: {$oid: string};
  name: string;
  description: string;
  creationDate: {$date: string};
  department: string;
  owner: string;
  rooms: [Room];
  modRoom: {$oid: string};
  userThread: {$oid: string};
  instructor: string | null;
  memberCount: number;
  semester: string;
}

export type Room = {
  _id: {$oid: string};
  name: string;
  courseId: {$oid: string};
  connected: [{username: string, sid: string}];
  messages: [{username: string, message: string, timeSent: {$date: string}}];
}

