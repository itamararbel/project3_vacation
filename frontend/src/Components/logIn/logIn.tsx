import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import "./logIn.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../redux/store";
import { logInUser } from "../../redux/userAuthentication";
import { userState } from "../../redux/userAuthentication";
import { decodeToken } from "react-jwt";
import serverUrl from "../../urls";

interface closeProp {
    setOpen: (params: boolean) => void;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f0ad4e',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function LogIn({ setOpen }: closeProp): JSX.Element {
    const { register, handleSubmit } = useForm()
    const [msg, setMsg] = useState<string>("")
    const [showToggle, setToggle] = useState<Boolean>(true)
    const navigate = useNavigate();



    const check = (user: any) => {
        axios.post(serverUrl.ServerUrl+"auth/log/", user, {
            headers: {
                "allow": "authorization"
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response)
                if (response.headers.authorization) {
                    const userLogged: userState = (decodeToken(response.headers.authorization) as any).user
                    userLogged.user_token = response.headers.authorization.split(" ")[1];
                    localStorage.setItem("userToken", userLogged.user_token)
                    console.log(userLogged)
                    userLogged && store.dispatch(logInUser(userLogged));
                }
                setOpen(false)
            }
        }).catch(error => {
            setMsg(error.response.data)
        })
    }

    const handleClose = () => {
        setMsg("");
    }

    return (
        <div className="logIn">
            <Modal
                open={msg !== "" ? true : false}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            ><Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {msg}
                    </Typography>
                </Box></Modal>
            <DialogTitle>log-in</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(check)}>
                    <TextField
                        autoFocus
                        {...register("user_name")}
                        margin="dense"
                        id="userName"
                        label="userName"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-password">password</InputLabel>
                        <Input
                            {...register("password")}
                            id="password"
                            type={showToggle ? "password" : "text"}
                            fullWidth
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setToggle(!showToggle)}
                                    >
                                        {showToggle ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <br />
                    <Button fullWidth type="submit" sx={{ mt: 2 }} color="secondary" variant="contained">log-In</Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button fullWidth type="submit" sx={{ mt: -3 }} onClick={() => navigate("/signIn")}>dont have a user yet?<u> <b>sign in for free</b></u></Button>
            </DialogActions>
        </div>
    );
}

export default LogIn;
