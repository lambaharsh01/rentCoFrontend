import { useEffect, useState } from "react"
import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";

import SearchableSelect from "./searchableSelect";

import { FcInspection } from "react-icons/fc";
import { MdCall } from "react-icons/md";
import { FiChevronsDown } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import isSmallScreen from "../utils/isSmallScreen";


import { getTenantDetails } from "../utils/redux/reduxInterceptors";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

let monthBoundary= getCurrentMonthBoundaries();

export default function VisitComponent({showButton=true, specificTenant=false, nameLabel="Select Tenant", id="", fromDate=monthBoundary.fromDate, toDate=monthBoundary.toDate}) {

    const navigate = useNavigate();
    const smallScreen = isSmallScreen();

    const [visits, setVisits] = useState([]);
    
    const [searchFrom, setSearchFrom] = useState(fromDate);
    const [searchTo, setSearchTo] = useState(toDate);
    
    const [tenantName, setTenantName] = useState(nameLabel);
    const [tenantId, setTenantId] = useState(id);

    const [tenantOptions, setTenantOptions] = useState([]);

    const [searched, setSearched] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        let optionsObject = getTenantDetails() ?? [];
        let tenants = optionsObject.map((element) => {
            return { tenantId: element.tenantId, label: element.label }
        });

        let newArray = [{tenantId:"", label:"None"}, ...tenants];
        setTenantOptions(newArray);
    }, []);
    
    const handleTenanSelection = (e) => {
        setTenantName(e.label);
        setTenantId(e.tenantId);
    }

    const searchTenants = () => {
        fetchData({ fromDate: searchFrom, toDate: searchTo, tenantId});
    }

    function fetchData(object) {
        setLoading(true);
        axiosInterceptor({
            url: "/api/visit/getVisits",
            method: "get",
            query: object
        }).then(res => {
            setVisits(res?.data?.filteredVisits ?? []);
            setSearched(true);
            setLoading(false);
        }).catch(err => {
            toast.error(err.message)
            setSearched(true);
            setLoading(false);
        })
        
    }

    const navigateVisit = (visitId) => {
        navigate("/viewVisit/" + visitId);
    }


    return <div className="w-100 p-2">

        {showButton && ( 
        <div className="w-100 mb-2 pb-1 flex justify-end">
            <button
                className="border-1 rounded-md me-1 flex p-1 font-medium shadow-sm"
                style={{ fontSize: 15 }}
                onClick={()=>navigate('/addVisit')}>
                <span className="me-1">Add Visit</span>
                <span className="mt-1"><FcInspection /></span>
            </button>
        </div>)}
        
        <div className="w-100 border-1 rounded-md">

            <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                Monthly Property Visits
            </div>

            <div className="w-100 p-2">

                <div className="font-medium flex justify-end items-center p-2">

                    <div className="w-100">
                        <div className="flex justify-around">
                        <div className="w-2/5">
                        <span className="text-sm font-light">From</span>
                        <br/>
                                <input type="date"
                                    className="w-100 p-1 rounded-sm bg-slate-100 border-1"
                                    value={searchFrom}
                                    onChange={(e) => setSearchFrom(e.currentTarget.value)}
                                />
                        </div>
                                                        
                        <div className="w-2/5">
                        <span className="text-sm font-light">To</span>
                        <br/>
                                <input
                                    type="date"
                                    className="w-100 p-1 rounded-sm bg-slate-100 border-1"
                                    value={searchTo}
                                    onChange={(e) => setSearchTo(e.currentTarget.value)}
                                />
                        </div>
                        </div>
                        
                        <div className="flex justify-around mt-2">
                        <div className="w-2/5">
                        <span className="text-sm font-light">Tenant</span>
                                <br />
                                <SearchableSelect
                                    inputClass="w-100 p-0.5 rounded-sm bg-slate-100 border-1 mb-2"
                                    options={tenantOptions}
                                    inputPlaceHolder={tenantName}
                                    onChange={handleTenanSelection}
                                />

                        </div>
                                                        
                        <div className="w-2/5 pt-4">
                            <button className="p-0.5 text-white rounded-sm bg-green-500 btn-sm w-100 mb-2" onClick={searchTenants}>Search</button>
                        </div>
                        </div>
                    </div>

                </div>
                
                <div className="border-y-2 mt-2 text-center">
                    {searched ? (
                    <span className="font-medium">Visits</span>
                    ): (
                    <div className="px-2 py-1 flex justify-center" onClick={searchTenants}>
                    <span className="me-2 font-semibold text-sm">Click Here/Search To Fetch Visit List</span>
                    <FiChevronsDown className="text-xl" />
                    </div>
                    )}
                    </div>

                <div className="w-100 scrolMaxHeight300 px-1 pt-2">


                    {searched && !visits.length && (
                        <div className="w-100 text-center">
                            <span className="text-sm font-light text-center">No Visits Found</span>
                        </div>
                    )}


                    {loading ? (
                    <span>
                        <Skeleton count={3} height={60} className="mb-3" />
                    </span>
                    ) : visits.map((element, index) => (
                        <div
                        key={`visit${index}`}
                            className={`font-medium w-100 bg-slate-100 mb-3 py-1 ps-4 pe-1 rounded-md flex justify-around items-center ${smallScreen ? "h-14 text-sm" : "h-20"}`}
                        >
                        <span onClick={()=>navigateVisit(element._id)} style={{width:"35%"}}>{element.propertyName}</span>
                        <span onClick={()=>navigateVisit(element._id)} style={{width:"20%"}}>₹{element.totalRent}</span>
                        <span onClick={()=>navigateVisit(element._id)} style={{ width: "20%" }}>{element.visitDate}</span> 
                        <a style={{width:"20%"}} href={`tel:${element.tenantPhoneNumber}`}>
                            <MdCall className="text-2xl"/>
                        </a>    
                    </div>
                    ))}
  

                </div>
           
            </div>

        </div>
    </div>
}
















// import { useState } from "react"
// import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";
// import axiosInterceptor from "../utils/axiosInterceptor";
// import { toast } from "react-toastify";

// import { FcInspection } from "react-icons/fc";
// import { useNavigate } from "react-router-dom";

// export default function VisitComponent() {

//     const navigate=useNavigate()
    
//     const currentMonthBoundaries = getCurrentMonthBoundaries();

//     const [visitSection, setVisitSection] = useState("");

//     const fetchPending = ({ fromDate, toDate }) => {

//         axiosInterceptor({
//             url: "/api/visit/getPendingVisits",
//             method: "get",
//             query: { fromDate, toDate }
//         }).then(res => {
            
            
//         }).catch(err => toast.error(err.message));
        
        
//         setVisitSection("Pending");
//     }


//     // const [completedDataFetched, setCompletedDataFetched] = useState(false);
//     // const [completedDataArray, setCompletedDataArray] = useState([]);

//     const fetchCompleted = () => {

//         setVisitSection("Completed")
        
//     }


//     return <div className="w-100 p-2">




//         <div className="w-100 border-1 rounded-md">

//             <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
//                 Monthly Property Visits
//             </div>

//             <div className="w-100 p-2">

//                 <div className="font-medium flex justify-around items-center pb-1">
//                     <span
//                         className={`${visitSection === "Pending" ? "font-bold rentCoRedFont" : ""}`}
//                         onClick={()=>fetchPending(currentMonthBoundaries)}
//                     >Pending</span>

//                     <span
//                         className={`${visitSection === "Completed" ? "font-bold rentCoRedFont" : ""}`}
//                         onClick={() => fetchCompleted()}
//                     > Completed</span>


//                 </div>

//                 {visitSection === "Pending" && (
//                     <div>Pending</div>
//                 )}



//                 {visitSection === "Completed" && (
//                     <div>Completed</div>
//                 )}
//                 <div></div>

//             </div>

//         </div>
//     </div>
// }