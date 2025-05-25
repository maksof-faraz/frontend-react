import './leftSidebar.css'
import { useContext } from 'react';
import { AuthContext } from '../../store/auth';
type HeaderProps = {
  callFunction: (param: string) => void;
};
export const LeftSidebar : React.FC<HeaderProps> = ({callFunction}) => {

    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <h2>{user.userName}</h2>
            <a onClick={()=>callFunction('All')}><i className="fa-solid fa-globe"></i>All Tasks</a>
            <a onClick={()=>callFunction('High')}><i className="fa-solid fa-turn-up"></i>High Priority</a>
            <a onClick={()=>callFunction('Medium')}><i className="fas fa-list"></i>Medium Priority</a>
            <a onClick={()=>callFunction('Low')}><i className="fas fa-level-down-alt"></i>Low Priority</a>
        </div>
    )
}