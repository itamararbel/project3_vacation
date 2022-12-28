import axios from "axios";
import { useEffect, useState } from "react";
import vacationModal from "../../modals/vicationModal";
import { store } from "../../redux/store";
import { UserRole } from "../../redux/userAuthentication";
import "./singleVacation.css";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Typography } from "@mui/material";

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


interface singleVacation extends vacationModal {
    updateFollow: (vacationId: number, isFollowed: boolean) => void;
    handleDelete: (id: number) => void;
}


function SingleVacation(item: singleVacation): JSX.Element {
    const [isFollowed, setIsFollowed] = useState<boolean>(item.isFollowed);
    const [open, setOpen] = useState<string>("");
    const [render, setRender] = useState<boolean>(false);
    const handleClose = () => setOpen("");
    const navigate = useNavigate();

    store.subscribe(() => {
        setRender(!render)
    })

    useEffect(() => {
        setIsFollowed(item.isFollowed);
        console.log(store.getState().authState.user_role);
    }, [item.isFollowed])

    const normalDate = (date: string) => {
        const tempDate = date.split("T")[0].split("-")
        return (Number(tempDate[2]) + 1) + "/" + tempDate[1] + "/" + tempDate[0];
    }
    const handleFollow = (id: number) => {
        if (store.getState().authState.user_role === UserRole.guest) {
            setOpen("you have to log in to follow a vacation")
        } else {
            const dbFollow = {
                vacation_id: id,
                user_id: store.getState().authState.user_id,
                user_role: store.getState().authState.user_role,
                user_name: store.getState().authState.user_name,
            }
            if (!isFollowed) {
                axios.post("http://localhost:3002/api/users/follow/", dbFollow,
                    {
                        headers: {
                            'authorization': `Bearer ${localStorage.getItem("userToken")}`
                        }
                    }).then(response => {
                        if (response.headers.authorization) {
                            localStorage.setItem("userToken", response.headers.authorization)
                        }
                        if (response.status === 200) {
                            setIsFollowed(!isFollowed)
                        }
                    }).catch(err => console.log(err))
            } else {
                axios.delete("http://localhost:3002/api/users/follow/" + dbFollow.vacation_id + "/" + dbFollow.user_id, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("userToken")}`
                    }
                }).then(response => {
                    if (response.headers.authorization) {
                        localStorage.setItem("userToken", response.headers.authorization)
                    }
                    if (response.status === 204) {
                        setIsFollowed(!isFollowed)
                    }
                }).catch(err => console.log(err))
            }
            item.updateFollow(item.vacation_id, isFollowed)
        }
    }
    return (
        <div className="singleVacation">
            <Modal
                open={open === "" ? false : true}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {open}
                    </Typography>
                </Box>
            </Modal>
            {store.getState().authState.user_role === UserRole.admin ? <><button onClick={() => navigate("/updateVacation/" + item.vacation_id)}>📝</button><button onClick={() => item.handleDelete(item.vacation_id)}>❌</button></> : <button onClick={() => handleFollow(item.vacation_id)}>{isFollowed ? "💗" : "🤍"}</button>}
            <h1>{item.destination}</h1>
            <hr/>
            <p>{item.description}</p>
            <img src={item.picture} alt="forget it \n its ugly" />
            <p>{`${normalDate(item.start_date)} - ${normalDate(item.end_date)}`}</p>
            <h2>החל מ : ${item.price} </h2>
        </div>
    );
}
export default SingleVacation;
