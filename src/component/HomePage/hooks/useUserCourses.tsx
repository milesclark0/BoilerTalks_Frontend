import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getUserCoursesURL } from "../../../API/CoursesAPI";
import { useAuth } from "../../../context/context";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Course, Room } from "../../../types/types";

type Props = {
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  getCourseFromUrl: () => Course | null;
  getRoomFromUrl: () => Room | null;
};


export const useUserCourses = ({setCurrentCourse, setCurrentRoom, setActiveIcon, getCourseFromUrl, getRoomFromUrl}: Props) => {
  const [userCourses, setUserCourses] = React.useState<Course[]>([]);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  //after useQuery is done, set the current course and room
  useEffect(() => {
    initCourseFromUrl(userCourses);
  }, [userCourses]);

  // gets the active courses from the user and returns the course data for each active course
  const getActiveCourses = () => {
    const activeCourses = [];
    user?.activeCourses.forEach((course) => {
      userCourses?.forEach((userCourse) => {
        if (course === userCourse.name) {
          activeCourses.push(userCourse);
        }
      });
    });
    return activeCourses;
  };

  const initCourseFromUrl = (data: any) => {
    const course = getCourseFromUrl();
    console.log(course);
    // if course name is in user active courses, set it as the active icon else set as the department name
    const activeCourses = getActiveCourses();
    if (course) {
      setCurrentCourse(course);
      if (activeCourses.find((activeCourse) => activeCourse.name === course?.name)) {
        setActiveIcon({ course: course?.name, isActiveCourse: true });
      } else {
        setActiveIcon({ course: course?.department, isActiveCourse: false });
      }
      const room = getRoomFromUrl();
      setCurrentRoom(room);
    } else {
      setActiveIcon({ course: "", isActiveCourse: false });
    }
  };

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesURL + user?.username);
  };

  const { isLoading, error, data } = useQuery("user_courses: " + user?.username, fetchCourse, {
    enabled: true,
    refetchInterval: 1000 * 60 * 2, //2 minutes
    staleTime: 1000 * 60 * 2, //2 minutes
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        //sort rooms by name
        const courses: Course[] = data.data.data;
        courses.forEach((course) => {
          course.rooms?.sort((a, b) => (a.name < b.name ? -1 : 1));
        });

        setUserCourses(courses);
        console.log("init course from url");
      } else setFetchError(data.data.data);
    },
    onError: (error: string) => console.log(error),
  });
  return { userCourses, setUserCourses, isLoading, error, fetchError };
};
