import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import "./addVacation.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import vacationModal from "../../modals/vicationModal";
import { useForm } from "react-hook-form";
import 'dayjs/locale/fr';
import axios from "axios";
import { store } from "../../redux/store";
import { UserRole, logInUser } from "../../redux/userAuthentication";
import { useNavigate, useParams } from "react-router-dom";
import serverUrl from "../../urls";

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


function AddVacation(): JSX.Element {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<vacationModal>();
    const [start_date, setStartDate] = useState<any>();
    const [end_date, setEndDate] = useState<any>();
    const navigate = useNavigate();
    const params = useParams();
    const [pic, setPic] = useState<any>();
    const [open, setOpen] = useState<string>("");

    const handleClose = () => setOpen("");


    if (store.getState().authState.user_role !== UserRole.admin) {
        navigate("/")
    }
    const id = params.id;


    useEffect(() => {
        if (params.id) {
            axios.get(serverUrl.ServerUrl+"vacations/id/" + id).then((response) => {
                const vacation: vacationModal = response.data[0];
                setValue("description", vacation.description);
                setValue("destination", vacation.destination);
                setValue("price", vacation.price);
                setValue("start_date", vacation.start_date.split("T")[0]);
                setValue("end_date", vacation.end_date.split("T")[0]);
                setStartDate(vacation.start_date.split("T")[0])
                setEndDate(vacation.end_date.split("T")[0])
                setPic(vacation.picture)
                console.log(vacation.picture)
            })
        }
    }, []);

    const send = (vacation: vacationModal) => {
        if (!pic || !start_date || !end_date) {
            setOpen("you forgot to add a picture, start date and/or end date")
        } else if (start_date >= end_date) {
            setOpen("you must leave before you come back")
        } else {
            vacation.pic = pic;
            vacation.start_date = start_date;
            vacation.end_date = end_date;

            if (!params.id) {
                axios.post(serverUrl.ServerUrl+ "vacations/add", vacation,{ 
                headers: {
                    'Authorization': `Bearer ${store.getState().authState.user_token}`,
                    "content-type": "multipart/form-data"
                }}).then((response) => {
                    if (response.headers.authorization) {
                        localStorage.setItem("userToken", response.headers.authorization)
                        const newState = {...store.getState().authState}
                        newState.user_token =  response.headers.authorization;
                        store.dispatch(logInUser(newState))
                    }
                    navigate("/")
                }).catch((err) => { console.log(err) })
            } else {
                vacation.vacation_id = params && Number(params.id);
                axios.put(serverUrl.ServerUrl+ "vacations/edit", vacation, {
                    headers: {
                        'Authorization': `Bearer ${store.getState().authState.user_token}`,
                        "content-type": "multipart/form-data"
                    }
                    
                }).then((response) => {
                    console.log(response.headers.authorization);
                    if (response.headers.authorization) {
                        localStorage.setItem("userToken", response.headers.authorization)
                        const newState = {...store.getState().authState}
                        newState.user_token =  response.headers.authorization;
                        store.dispatch(logInUser(newState))
                    }
                    navigate("/")
                }).catch((err) => { console.log(err) })
            }
        }
    }


    return (
        <div className="addVacation">
            <Modal
                open={open === "" ? false : true}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {open}
                    </Typography>
                </Box>
            </Modal>
            <Box
                onSubmit={handleSubmit(send)}
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }, bgcolor: "aliceblue", width: "60%", m: "auto", minWidth: "400px"
                }}
                noValidate
                autoComplete="off"
            >
                {/* <form className="addForm"> */}
                <div><br></br>
                    <h2>{params.id ? `editing vacation id number ${id}` : "Add a vacation"}</h2>
                    <br></br>
                    <TextField
                        {...register("destination", { required: "u forgot to enter the destination" })}
                        id="outlined-error"
                        label="Destination"
                        variant="standard"
                        helperText={errors.destination && errors.destination.message}
                    />
                    <TextField
                        type="number"
                        id="outlined-error-helper-text"
                        label="plz enter price"
                        variant="standard"
                        {...register("price", { required: "u got to add price" })}
                        helperText={errors.price && errors.price.message}

                    />
                </div>
                <div>

                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale='fr'>
                        <DatePicker
                            {...register("end_date", { required: "so... when do we return" })}

                            label="Pick start date"
                            value={start_date}
                            onChange={(date) => setStartDate((date.$y) + "-" + (date.$M + 1) + "-" + (date.$D))}
                            renderInput={(params) => <TextField {...params}
                                {...register("start_date", { required: "so... when do we leave" })} />}
                        />
                        {errors.start_date && <p>{errors.start_date.message}</p>}
                        <DatePicker
                            {...register("end_date", { required: "so... when do we return" })}
                            label="Pick end date"
                            value={end_date}
                            onChange={(date) => setEndDate((date.$y) + "-" + (date.$M + 1) + "-" + (date.$D))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        {errors.end_date && <p>{errors.end_date.message}</p>}

                    </LocalizationProvider>
                </div>
                <TextField
                    {...register("description", { required: "so... what can u tell us " })}
                    label="Vacation Description"
                    placeholder="Placeholder"
                    multiline
                    variant="standard"
                    helperText={errors.description && errors.description.message}
                />
                {pic && <img src={`http://localhost:8082/images/`+pic} alt="there where no pic"></img>}
                <Button
                    variant="contained"
                    component="label"
                    sx={{ mb: -3, mt: 2, width: '75%' }}
                > {pic ? "click again to choose another" : "add a picture"}
                    <input
                        name="upload"
                        type="file"
                        onChange={(e: any) => {
                            e.preventDefault();
                            setPic(e.target.files[0])
                        }
                        }
                        hidden
                    />
                </Button >
                <Button sx={{ m: 3, width: '75%' }} fullWidth color="secondary" variant="contained" type="submit"> submit</Button>
            </Box >


        </div >

    );
}

export default AddVacation;

