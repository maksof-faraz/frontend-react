import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import './appLayout.css'; // Import the CSS file
import { LeftSidebar } from "./LeftSidebar";
import { useRef } from "react";



const AppLayout = () => {

    const outletFunctionRef = useRef<((param: string) => void) | null>(null); 

    const handleCallOutletFunction = (param : string) => {
        if (outletFunctionRef.current) {
            outletFunctionRef.current(param);
        }
    };
    return <>
        <Header  />
        <div className="main-content">
            <Outlet context={{ setFunctionRef: (fn: (param: string) => void) => outletFunctionRef.current = fn }} />
        </div>
        <LeftSidebar callFunction={handleCallOutletFunction} />
    </>
}

export default AppLayout;