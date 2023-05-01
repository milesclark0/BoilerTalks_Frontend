import { IconButton } from "globals/mui";
import { setCourseActiveURL } from "API/CoursesAPI";
import { useAuth } from "context/context";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { Course } from "globals/types";
import PushPinIcon from "@mui/icons-material/PushPin";

export const PinIcon = ({ course }: { course: Course }) => {
  const api = useAxiosPrivate();
  const { user, setUser, themeSetting } = useAuth();
  const activeCourseSwitch = async (course: Course) => {
    try {
      const res = await api.post(setCourseActiveURL, { courseName: course?.name, username: user?.username });
      console.log(res);

      if (res.data.statusCode == 200) {
        if (res.data.data == "removing") {
          setUser({ ...user, activeCourses: [...user.activeCourses.filter((courseName) => course?.name != courseName)] });
        } else {
          setUser({ ...user, activeCourses: [...user.activeCourses, course?.name] });
        }
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isActiveCourse = user.activeCourses?.includes(course?.name);
  const color = isActiveCourse ? "secondary" : "primary";
  return (
    <IconButton onClick={() => activeCourseSwitch(course)} sx={{ transform: "rotate(45deg)" }}>
      <PushPinIcon color={color} />
    </IconButton>
  );
};
