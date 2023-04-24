import { useQuery } from "react-query";
import { Course, Room } from "../../../globals/types";
import { useAuth } from "../../../context/context";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getUserCoursesAndRoomsURL } from "../../../API/CoursesAPI";
import { useEffect, useState } from "react";
import useStore from "../../../store/store";

const useUserCourseData = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [userCourseList, setUserCourseList] = useStore((state) => [state.userCourseList, state.setUserCourseList]);

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesAndRoomsURL + user?.username);
  };

  const { isLoading, error } = useQuery("courses: " + user?.username, fetchCourse, {
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

function sortRoomsByName(rooms: [string, { $oid: string }][]) {
  rooms.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return rooms;
}

export default useUserCourseData;
