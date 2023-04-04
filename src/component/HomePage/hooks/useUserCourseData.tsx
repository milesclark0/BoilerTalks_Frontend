import { useQuery } from "react-query";
import { Course, Room } from "../../../globals/types";
import { useAuth } from "../../../context/context";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getUserCoursesAndRoomsURL } from "../../../API/CoursesAPI";
import { useEffect, useState } from "react";
import useStore from "../../../store/store";

type Props = {
  getCourseFromUrl: () => Course | null;
  getRoomFromUrl: () => Room | null;
};
const useUserCourseData = ({ getCourseFromUrl, getRoomFromUrl }: Props) => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [
    setCurrentCourse,
    setCurrentRoom,
    setActiveIcon,
    userCourseList,
    setUserCourseList,
  ] = useStore((state) => [
    state.setCurrentCourse,
    state.setCurrentRoom,
    state.setActiveIcon,
    state.userCourseList,
    state.setUserCourseList,
  ]);

  // const initCourseFromUrl = (data: any) => {
  //   const course = getCourseFromUrl();
  //   // if course name is in user active courses, set it as the active icon else set as the department name
  //   const activeCourses = user?.activeCourses;
  //   if (course) {
  //     setCurrentCourse(course);
  //     if (activeCourses.find((activeCourse) => activeCourse === course?.name)) {
  //       setActiveIcon(course?.name, true);
  //     } else {
  //       setActiveIcon(course?.department, false);
  //     }
  //     const room = getRoomFromUrl();
  //     setCurrentRoom(room);
  //   }
  // };
  //after useQuery is done, set the current course and room
  useEffect(() => {
    console.log("UserCourseList: ", userCourseList);
    
    // initCourseFromUrl(userCourseList);
  }, [userCourseList]);

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesAndRoomsURL + user?.username);
  };

  const {isLoading, error} = useQuery("courses_rooms: " + user?.username, fetchCourse, {
    enabled: true,
    //refetchInterval: 1000 * 60 * 2, //2 minutes
    staleTime: 1000 * 60 * 10, //10 minutes
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        const sortedCourses = sortCoursesByDepartment(data.data.data[0]);
        sortedCourses.forEach((course) => {
          course.rooms = sortRoomsByName(course.rooms);
        });
        setUserCourseList(sortedCourses);
      }
    },
  });
  return { userCourseList, isUserCourseListLoading: isLoading, userCourseListError: error };
};

function sortCoursesByDepartment(courses: Course[]) {
  courses.sort((a, b) => (a.department < b.department ? -1 : 1));
  return courses;
}

function sortRoomsByName(rooms: [string, {$oid: string}][]) {
  rooms.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return rooms;
}

export default useUserCourseData;
