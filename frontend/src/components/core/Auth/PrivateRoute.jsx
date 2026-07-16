import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const ALLOWED_WHEN_BANNED = [
    "/dashboard/settings",
    "/dashboard/my-profile",
]

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const location = useLocation();

    if (token === null)
        return <Navigate to="/signup" />

    if (user?.active === false && !ALLOWED_WHEN_BANNED.includes(location.pathname))
        return <Navigate to="/banned" />

    return children
}

export default PrivateRoute
