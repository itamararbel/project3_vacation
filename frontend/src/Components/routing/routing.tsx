import { Route, Routes } from "react-router-dom";
import AddVacation from "../addVacation/addVacation";
import Vacations from "../vacations/vacations";
import "./routing.css";
import Statistics from "../statistics/statistics";

function Routing(): JSX.Element {
    return (
        <div className="routing">
            <Routes>
              <Route path="/vacations" element={<Vacations/>}></Route>
              <Route path="/addVacation" element={<AddVacation/>}></Route>
              <Route path="/updateVacation/:id" element={<AddVacation/>}></Route>
              <Route path="/statistics" element={<Statistics/>}></Route>
              <Route path="/*" element={<Vacations/>}></Route>
            </Routes>
			
        </div>
    );
}

export default Routing;
