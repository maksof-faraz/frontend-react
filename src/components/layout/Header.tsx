import './header.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';



export const Header = () => {

    
    const navigate = useNavigate();
    const logOutUser = () => {
        localStorage.removeItem('token');
        navigate('/loginRegister')
    }

    return (
        <div className="header">
            <span className="title">Task Management System</span>
            <button className="btn btn-primary" onClick={logOutUser}>Logout</button>

        </div>
    )
}