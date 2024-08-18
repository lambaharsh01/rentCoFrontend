import { useState } from "react"
import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

import { FcInspection } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function VisitDashboard() {

    const navigate=useNavigate()
    
    const currentMonthBoundaries = getCurrentMonthBoundaries();

    const [visitSection, setVisitSection] = useState("");

    // const [pendingDataFetched, setPendingDataFetched] = useState(false);
    // const [pendingDataArray, setPendingDataArray] = useState([]);

    
    const fetchPending = ({ fromDate, toDate }) => {

        axiosInterceptor({
            url: "/api/visit/getPendingVisits",
            method: "get",
            query: { fromDate, toDate }
        }).then(res => {
            
            
        }).catch(err => toast.error(err.message));
        
        
        setVisitSection("Pending");
    }


    // const [completedDataFetched, setCompletedDataFetched] = useState(false);
    // const [completedDataArray, setCompletedDataArray] = useState([]);

    const fetchCompleted = () => {

        setVisitSection("Completed")
        
    }


    return <div className="w-100 p-2">

        <div className="w-100 border-1 rounded-t-3xl">

            <div className="rentCoRed rounded-t-3xl text-center py-1 font-bold">
                Monthly Property Visits
            </div>

            <div className="w-100 p-2">

                <div className="font-medium flex justify-around items-center pb-1">
                    <span
                        className={`${visitSection === "Pending" ? "font-bold rentCoRedFont" : ""}`}
                        onClick={()=>fetchPending(currentMonthBoundaries)}
                    >Pending</span>

                    <span
                        className={`${visitSection === "Completed" ? "font-bold rentCoRedFont" : ""}`}
                        onClick={() => fetchCompleted()}
                    > Completed</span>

                    <button
                        className="flex p-1 font-medium"
                        style={{ fontSize: 15 }}
                    onClick={()=>navigate('/addVisit')}>
                        <span className="me-1">Add Visit</span>
                        <span className="mt-1"><FcInspection /></span>
                    </button>

                </div>

                {visitSection === "Pending" && (
                    <div>Pending</div>
                )}



                {visitSection === "Completed" && (
                    <div>Completed</div>
                )}
                <div></div>

            </div>

        </div>
    </div>
}