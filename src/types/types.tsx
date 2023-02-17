export type User = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  _id: {$oid: string};
  profilePicture: string;
  courses: string[];
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
  generalRoom: {$oid: string};
  modRoom: {$oid: string};
  userThread: {$oid: string};
  instructor: string | null;
  memberCount: number;
  semester: string;
}

