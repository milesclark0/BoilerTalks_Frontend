import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getCourseUsersURL } from "../../../API/CoursesAPI";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Course } from "../../../types/types";

type Props = {
  activeIcon: { course: string; isActiveCourse: boolean };
  currentCourse: Course | null;
  isCourseSelected: () => boolean;
};

export const useCourseUsers = ({ activeIcon, currentCourse, isCourseSelected }: Props) => {
  const [courseUsers, setCourseUsers] = React.useState([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchCourseUsers = async () => {
    return await axiosPrivate.get(getCourseUsersURL + activeIcon.course);
  };
  
  // will run if currentCourse is not null and the currentCourse changes
  useQuery(["currentCourse", currentCourse?._id.$oid], fetchCourseUsers, {
    enabled: !!currentCourse, // only run if currentCourse is not null
    onSuccess: (data) => {
      console.log("success");
      setCourseUsers(data.data.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { courseUsers };
};