import { useEffect, useState } from "react";
import "./statistics.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import axios from "axios";
import { store } from "../../redux/store";
import { UserRole } from "../../redux/userAuthentication";
import { useNavigate } from "react-router-dom";
import serverUrl from "../../urls";


function Statistics(): JSX.Element {
    const [chartData, setChartData] = useState<any[]>([]);
    
    store.subscribe(() => {
       store.getState().authState.user_role!==UserRole.admin && navigate("/");
    });
    const navigate = useNavigate();

    
    useEffect(() => {
        if (store.getState().authState.user_role !== UserRole.admin) {
            navigate("/")
        }
        axios.get(serverUrl.ServerUrl+"vacations/followStatistics", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then((response) => {
            if (response.headers.authorization) {
                localStorage.setItem("userToken", response.headers.authorization)
            }
            const sortedData = response.data.sort((a:any,b:any) => a.numberOfFollowers > b.numberOfFollowers? -1:a.numberOfFollowers<b.numberOfFollowers?1 :0)
            setChartData(sortedData)
        })
    }, [navigate])

    return (
        <div className="statistics">
            <h2>follower statistics</h2>
            <BarChart width={600} height={300} data={chartData}>
                <XAxis dataKey="name" stroke="black" />
                <YAxis dataKey="numberOfFollowers" stroke="black" />
                <Tooltip />
                <Bar dataKey="numberOfFollowers" fill="darkcyan" barSize={30} />
            </BarChart>
        </div>
    );
}

export default Statistics;
