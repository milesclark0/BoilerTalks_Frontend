import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getCourseUsersURL } from "API/CoursesAPI";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { Course } from "globals/types";
import useStore from "store/store";
import { useParams } from "react-router-dom";

export const useCourseUsers = () => {
  const [currentCourse, courseUsers, setCourseUsers] = useStore((state) => [state.currentCourse, state.courseUsers, state.setCourseUsers]);
  const axiosPrivate = useAxiosPrivate();
  const { courseId } = useParams();

  const fetchCourseUsers = async () => {
    return await axiosPrivate.get(getCourseUsersURL + currentCourse?.name);
  };

  // will run if currentCourse is not null and the currentCourse changes
  const { data } = useQuery(["courseUsers", currentCourse?._id.$oid], fetchCourseUsers, {
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
    },
  });

  return { courseUsers };
};
