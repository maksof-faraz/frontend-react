import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { ChildrenProps, userInfo } from "../types/userTypes";

const ProtectedRoute = ({ children }: ChildrenProps) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/loginRegister" />;

    try {
        const decoded: userInfo = jwtDecode(token);
        console.log(decoded, 'decoded')
        const currentTime = Date.now() / 1000;
        if ((decoded.exp && decoded.exp < currentTime)) {
            localStorage.removeItem('token');
            return <Navigate to="/loginRegister" />;
        }
        return children;

    } catch (err) {
        localStorage.removeItem('token');
        return <Navigate to="/loginRegister" />;
    }
};

export default ProtectedRoute;