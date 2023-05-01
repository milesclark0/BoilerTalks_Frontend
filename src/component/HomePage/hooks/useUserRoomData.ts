import { useQuery } from "react-query";
import { Course, Room } from "globals/types";
import { useAuth } from "context/context";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { getUserCoursesAndRoomsURL } from "API/CoursesAPI";
import { useState } from "react";
import useStore from "store/store";

const useUserRoomData = () => {
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [userRoomsList, setUserRoomList] = useStore((state) => [
        state.userRoomsList,
        state.setUserRoomsList,
    ]);

    const fetchCourse = async () => {
        return await axiosPrivate.get(getUserCoursesAndRoomsURL + user?.username);
    };

    const { isLoading, error } = useQuery("courses_rooms: " + user?.username, fetchCourse, {
        enabled: true,
        //refetchInterval: 1000 * 60 * 2, //2 minutes
        staleTime: 1000 * 60 * 10, //10 minutes
        refetchOnMount: "always",
        onSuccess: (data) => {
            if (data.data.statusCode === 200) {
                setUserRoomList(sortRoomsByName(data.data.data[1]));
            }
        },
    });
    return { userRoomsList, isUserRoomsListLoading: isLoading, userRoomsListError: error };
};

function sortRoomsByName(rooms: Room[]) {
    rooms.sort((a, b) => (a.name < b.name ? -1 : 1));
    console.log("userRoomsList: ", rooms);
    return rooms;
}


export default useUserRoomData;
