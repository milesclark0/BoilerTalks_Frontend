import { useQuery } from "react-query";
import { Course, Room } from "../../../globals/types";
import { useAuth } from "../../../context/context";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getUserCoursesAndRoomsURL } from "../../../API/CoursesAPI";
import { useState } from "react";

const useUserCourseData = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [userCourseList, setUserCoursesList] = useState<Course[]>([]);
  const [userRoomsList, setUserRoomsList] = useState<Room[]>([]);
  const [fetchError, setFetchError] = useState<string>("");

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesAndRoomsURL + user?.username);
  };

  const { isLoading, error } = useQuery("courses_rooms: " + user?.username, fetchCourse, {
    enabled: true,
    //refetchInterval: 1000 * 60 * 2, //2 minutes
    staleTime: 1000 * 60 * 2, //2 minutes
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        setUserCoursesList(sortCoursesByDepartment(data.data.data[0]));
        setUserRoomsList(sortRoomsByName(data.data.data[1]));
      } else {
        setFetchError(data.data.message);
      }
    },
    onError: (error: string) => {
      setFetchError(error);
    },
  });

  return { isUserDataLoading: isLoading, userCourseList, userRoomsList, isUserDataError: fetchError };
};

function sortRoomsByName(rooms: Room[]) {
  rooms.sort((a, b) => (a.name < b.name ? -1 : 1));
  return rooms;
}

function sortCoursesByDepartment(courses: Course[]) {
  console.log(courses);

  courses.sort((a, b) => (a.department < b.department ? -1 : 1));
  return courses;
}

export default useUserCourseData;
