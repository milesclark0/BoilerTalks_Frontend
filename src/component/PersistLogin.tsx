import {Outlet} from 'react-router-dom';
import {useEffect, useState} from 'react';
import useRefreshToken from 'hooks/useRefreshToken';
import { useAuth } from 'context/context';

// Allows the user to persist their login session 
// after page navigation or refresh by verifying the refresh token

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {isLoggedIn} = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (error) {
                console.log("Could not verify refresh token");
                
            }
            finally {
                setIsLoading(false);
            }
        }
        !isLoggedIn ? verifyRefreshToken() : setIsLoading(false);

    }, [])

    return (
        <>
            {isLoading 
            ? <h1>Loading...</h1> 
            : <Outlet />}
        </>
    )
}

export default PersistLogin;
