import { FormControlLabel, Pagination, PaginationItem, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import vacationModal from "../../modals/vicationModal";
import { store } from "../../redux/store";
import SingleVacation from "../singleVacation/singleVacation";
import "./vacations.css";
import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { logInUser, userState } from "../../redux/userAuthentication";
import { decodeToken } from "react-jwt";

function Vacations(): JSX.Element {
    enum sorting { "Date", "price", "destination" }

    const [vacationsArr, setVacationsArr] = useState<vacationModal[]>([]);
    const [user, setUser] = useState<number>(store.getState().authState.user_id);
    const [toggleButton, setToggle] = useState<boolean>(false);
    const [dbVacations, setDbVacations] = useState<vacationModal[]>([]);

    const getAllVacations = (user: number) => {
        console.log("fdsafd")
        axios.get("http://localhost:3002/api/vacations/all/" + user).then((response) => {
            console.log("after")
        setDbVacations(response.data)
            setVacationsArr(response.data)
            console.log(store.getState().authState)
        })
    }

    useEffect(() => {
        if (localStorage.getItem("userToken") && !store.getState().authState.user_token) {
            axios.post("http://localhost:3002/api/auth/checkIsLog", "void" ,{
                headers: {
                    'authorization': `Bearer ${localStorage.getItem("userToken")}`
                }
            }).then((response) => {
                console.log(response);

                if (response.headers.authorization) {
                    const userLogged: userState = (decodeToken(response.headers.authorization.split(" ")[1]) as any).user
                    userLogged.user_token = response.headers.authorization.split(" ")[1];
                    localStorage.setItem("userToken", userLogged.user_token)
                    console.log(userLogged)
                    userLogged && store.dispatch(logInUser(userLogged));
                    getAllVacations(userLogged.user_id)
                }
            })
            } else  {
            getAllVacations(user)
        }
    }, [user]);

    store.subscribe(() => {
        setUser(store.getState().authState.user_id)
    });

    const handleDelete = (id: number) => {
        axios.delete("http://localhost:3002/api/vacations/" + id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((response) => {
            if (response.headers.authorization) {
                localStorage.setItem("userToken", response.headers.authorization)
            }
            if (response.status === 204) {
                let newArr = dbVacations.filter(item => item.vacation_id !== id)
                setVacationsArr(newArr);
            }
        })
    }

    const updateFollow = (vacationId: number, isFollowed: boolean) => {
        const vacations = dbVacations;
        const index = dbVacations.map(item => item.vacation_id).indexOf(vacationId);
        vacations[index].user_id = isFollowed ? undefined : user;
        setDbVacations(vacations);
    }

    const filterFollowed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToggle(!toggleButton)
        const filterFollowed = event.target.checked;
        setUser(store.getState().authState.user_id)
        if (filterFollowed) {
            setVacationsArr(dbVacations.filter(item => item.user_id))
        } else {
            setVacationsArr(dbVacations)
        }
    }

    const [newPage, setPage] = useState(0);
    const handleChangePage = (event: ChangeEvent<unknown> | null, page: number): void => {
        setPage(page - 1);
    };
    const [sortBy, setSort] = useState(sorting.Date);
    const handleSort = (event: React.MouseEvent<HTMLElement>, newSort: number,) => {
        switch (newSort) {
            case 0: setVacationsArr(vacationsArr.sort((a, b) => (a.start_date > b.start_date) ? 1 : ((b.start_date > a.start_date) ? -1 : 0)));
                break;
            case 1: setVacationsArr(vacationsArr.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)));
                break;
            case 2: setVacationsArr(vacationsArr.sort((a, b) => (a.destination > b.destination) ? 1 : ((b.destination > a.destination) ? -1 : 0)));

        }
        setSort(newSort);
    };
    return (
        <div className="vacations">
            <div className="filters">
                <FormControlLabel
                    control={<Switch
                    onChange={filterFollowed}
                    />}
                    labelPlacement="start"
                    label={"show only followed vacations?"}
                    disabled={store.getState().authState.user_role === 1 ? false : true}
                />
                <Pagination
                    sx={{ width: "fit-content" }}
                    onChange={handleChangePage}
                    count={Math.ceil(vacationsArr.length / 10)}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                            {...item}
                        />
                    )}
                />
                <div>
                    sort-by
                    <ToggleButtonGroup
                        color="primary"
                        value={sortBy}
                        exclusive
                        onChange={handleSort}
                        aria-label="Platform"
                    >
                        <ToggleButton value={sorting.Date} >Date</ToggleButton>
                        <ToggleButton value={sorting.destination}>destination</ToggleButton>
                        <ToggleButton value={sorting.price}>price</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <br></br>
            {vacationsArr.slice((newPage * 10), newPage * 10 + 10).map((item) => 
            <SingleVacation key={item.vacation_id} vacation_id={item.vacation_id} description={item.description} 
             destination={item.destination} picture={item.picture.substring(0, 4) === "http" ?
             item.picture : `http://localhost:3002/images/${item.picture}`} start_date={item.start_date} 
             end_date={item.end_date} price={item.price} follow_num={item.follow_num} 
             isFollowed={item.user_id !== null ? true : false} updateFollow={updateFollow} 
             handleDelete={handleDelete} />)}
        </div>
    );
}
export default Vacations;
