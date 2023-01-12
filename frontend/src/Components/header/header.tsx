import { Button, Dialog } from "@mui/material";
import React, { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { store } from "../../redux/store";
import { logOut, UserRole } from "../../redux/userAuthentication";
import LogIn from "../logIn/logIn";
import SignIn from "../signIn/signIn";
import "./header.css";
import { Box } from "@mui/system";
import Greeting from "../greeting/greeting";

function Header(): JSX.Element {
    const buttonCss = {
        minWidth: "fit-content", width: 170, position: 'absolute', Height: 100, top: "3%", right: "50px", background: "transparent", color: "white"
    }
    const [r, setRender] = useState<boolean>(false)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const log_Out = () => {
        store.dispatch(logOut());
    }
    store.subscribe(() => {
        setRender(!r)
    })

    return (
        <div className="header">


            {store.getState().authState.user_role !== UserRole.guest ? <Box sx={buttonCss}>
                <span style={{ background: "transparent" }}>welcome {store.getState().authState.user_name}</span>
                <Button onClick={log_Out} sx={{ color: 'red' }}><u>logout</u></Button></Box> : <Button variant="contained"
                    onClick={handleClickOpen} sx={buttonCss}>"log-In / sign-In"</Button>}
            <h1> followFly - follow your dream vacations  {r}</h1>
            <div className="menuContainer" hidden={store.getState().authState.user_role === UserRole.admin ? false : true}>
                <div className="linksDiv"><NavLink className="links" to="/vacations">vacations</NavLink></div>
                <div className="linksDiv"><NavLink className="links" to="/addVacation">Add vacation</NavLink></div>
                <div className="linksDiv"><NavLink className="links" to="/statistics">statistics</NavLink></div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <Routes>
                    <Route path="/signIn" element={<SignIn/>}></Route>
                    <Route path="/*" element={<LogIn setOpen={setOpen} />}></Route>
                    <Route path="/greeting" element={<Greeting setOpen={setOpen} />}></Route>
                </Routes>
            </Dialog>
        </div>
    );
}

export default Header;
