import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const GuestRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestRoute;