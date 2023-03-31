// since courses grabs private data, we need to use private axios, which can only be used in a hook
// thus only the urls are exported

export const getAllCoursesURL = "/courses/getAllCourses";

export const addCourseURL = "/courses/addCourse";

export const deleteCourseURL = "/courses/deleteCourse";

export const getCourseURL = "/courses/getCourse/";

export const getUserCoursesURL = "/courses/getUserCourses/";

export const getCourseUsersURL = "/courses/getCourseUsers/";

export const subscribeToCourseURL = "/courses/subscribeToCourses";

export const unsubscribeFromCourseURL = "/courses/unsubscribeFromCourse";

export const setCourseActiveURL = "/courses/setActiveCourse";

export const addRoomToCourseURL = "/courses/addRoomToCourse";

export const getUserCoursesAndRoomsURL = "/courses/getUserCoursesAndRooms/";
