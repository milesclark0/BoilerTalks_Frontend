import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getCourseUsersURL } from "../../../API/CoursesAPI";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Course } from "../../../globals/types";
import useStore from "../../../store/store";
import { useParams } from "react-router-dom";


export const useCourseUsers = () => {
  const  [activeIcon, courseUsers, setCourseUsers] = useStore((state) => [
    state.activeIcon,
    state.courseUsers,
    state.setCourseUsers,
  ]);
  const axiosPrivate = useAxiosPrivate();
  const {courseId} = useParams()

  const fetchCourseUsers = async () => {
    return await axiosPrivate.get(getCourseUsersURL + activeIcon.course);
  };

  // will run if currentCourse is not null and the currentCourse changes
  const { data } = useQuery(["courseUsers", courseId], fetchCourseUsers, {
    enabled: !!courseId, // only run if currentCourse is not null
    refetchOnMount: "always",
    refetchInterval: 1000 * 60 * 2, //2 minutes
    // staleTime: 1000 * 60 * 2, //2 minutes
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log("Course Users: ", data.data.data);
      setCourseUsers(data.data.data);
    }
  });

  return { courseUsers };
};
