import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import "./greeting.css";
import { Button } from "@mui/material";

interface closeProp {
    setOpen: (params: boolean) => void;
}
function Greeting({ setOpen }: closeProp): JSX.Element {
const navigate = useNavigate();
    const handleClick=()=>{
    setOpen(false); 
    navigate("/");
}
    return (
        <div className="greeting">
                    <h1>welcome {store.getState().authState.user_name} we are so happy you are here</h1>
                    <Button variant="contained" fullWidth color="secondary" onClick={handleClick}>happy to be here</Button>
        </div>
    );
}

export default Greeting;
