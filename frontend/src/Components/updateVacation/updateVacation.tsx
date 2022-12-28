import "./updateVacation.css";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import vacationModal from "../../modals/vicationModal";
import { useForm } from "react-hook-form";
import 'dayjs/locale/fr';
import axios from "axios";
import { store } from "../../redux/store";
import { UserRole } from "../../redux/userAuthentication";
import { useNavigate, useParams } from "react-router-dom";

function UpdateVacation(): JSX.Element {
    const { register, handleSubmit, setValue ,formState: { errors } } = useForm<any>();
    const [start_date, setStartDate] = useState<any>();
    const [end_date, setEndDate] = useState<any>();
    const navigate = useNavigate();
    const params = useParams();
    const [pic, setPic] = useState<any>();
    const [vacationToEdit, setVacation] = useState<vacationModal>()

    useEffect(() => {
        const id = params.id;
        axios.get("http://localhost:3002/api/vacations/id/" + id).then((response) => {
            setVacation(response.data[0]);
            setValue ("destination", response.data[0].description) 
            setValue("price" , response.data[0].price)
            setValue ("description", vacationToEdit?.description)
                
        })
    }, [])


    if (store.getState().authState.userRole !== UserRole.admin) {
        navigate("/")
    }

    const send = (vacation: vacationModal) => {
        // if (start_date.$d >= end_date.$d) {
        //     alert("you must leave before you come back")
        // } else {
        //     vacation.pic = pic;
        //     vacation.start_date = start_date.$y + "-" + (start_date.$M + 1) + "-" + start_date.$D;
        //     vacation.end_date = end_date.$y + "-" + (end_date.$M + 1) + "-" + end_date.$D;
        //     axios.post("http://localhost:3002/api/vacations/add", vacation, {
        //         headers: {
        //             "content-type": "multipart/form-data"
        //         }
        //     }).then((response) => {
        //         console.log(response.data, response.status)
        //         navigate("/")
        //     })
        // }
        console.log(vacation);
    }
    const arrangeDate = (date: string) => {
        let tempDate = date.split("T")[0].split("-")
        date = tempDate[2] + "/" + tempDate[1] + "/" + tempDate[0]
        return date;
    }

    return (
        <div className="updateVacation">
            <Box
                onSubmit={handleSubmit(send)}
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }, bgcolor: "aliceblue", width: "60%", m: "auto", minWidth: "400px"
                }}
                autoComplete="on"
            >
                <div><br></br>
                    <h2>Updating vacation to {vacationToEdit?.destination} on {vacationToEdit && arrangeDate(vacationToEdit?.start_date)}</h2>
                    <br></br>
                    <TextField
                      hiddenLabel

                        {...register("destination", )}
                        defaultValue = {vacationToEdit?.destination}
                        id="outlined-error"
                        label={vacationToEdit?.destination}
                        variant="standard"
                        helperText={errors.destination && errors.destination.message}
                    />
                    <TextField
                        type="number"
                        defaultValue={vacationToEdit?.price}
                        id="outlined-error-helper-text"
                        label={vacationToEdit?.price}
                        variant="standard"
                        {...register("price",)}
                        helperText={errors.price && errors.price.message}
                    />
                </div>
                <div>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale='fr'
                    >
                        <DatePicker
                            label={"original start date"}
                            value={ vacationToEdit?.start_date}
                            onChange={(date) => setStartDate(date)}
                            renderInput={(params) => <TextField {...params}  {...register("start_date", { required: "so... when do we leave" })} />}
                        />
                        {errors.start_date && <p>{errors.start_date.message}</p>}
                        <DatePicker
                            {...register("end_date", )}
                            label="original end date"
                            value={vacationToEdit?.end_date}
                            onChange={(end_date) => setEndDate(end_date)}
                            // .$D + "/" + (Number(end_date.$M) + 1) + "/" + end_date.$y);
                            renderInput={(params) => <TextField {...params} />}
                        />
                        {errors.end_date && <p>{errors.end_date.message}</p>}
                    </LocalizationProvider>
                </div>
                <TextField
                    {...register("description", )}
                    defaultValue={vacationToEdit?.description}
                    label= {vacationToEdit?.description}
                    multiline
                    variant="standard"
                    helperText={errors.description && errors.description.message}
                />
                <img src={vacationToEdit?.picture} alt="there where no pic"></img>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ mb: -3, mt: 2, width: '75%' }}
                > click for a different picture
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
        </div>
    );
}

export default UpdateVacation;
