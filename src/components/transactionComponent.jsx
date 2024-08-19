import { useEffect, useState } from "react"
import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";

import SearchableSelect from "./searchableSelect";

import { GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import { MdCall, MdOutlineWhatsapp } from "react-icons/md";
import isSmallScreen from "../utils/isSmallScreen";


import { getTenantDetails } from "../utils/redux/reduxInterceptors";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

let monthBoundary= getCurrentMonthBoundaries();

export default function TransactionComponent({showButton=true, specificTenant=false, nameLabel="Select Tenant", id="", fromDate=monthBoundary.fromDate, toDate=monthBoundary.toDate}) {

    const navigate = useNavigate();
    const smallScreen = isSmallScreen();

    const [transactions, setTransactions] = useState([]);
    
    const [searchFrom, setSearchFrom] = useState(fromDate);
    const [searchTo, setSearchTo] = useState(toDate);
    
    const [tenantName, setTenantName] = useState(nameLabel);
    const [tenantId, setTenantId] = useState(id);

    const [tenantOptions, setTenantOptions] = useState([]);

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

        axiosInterceptor({
            url: "/api/transaction/getTransactions",
            method: "get",
            query: object
        }).then(res => {
            setTransactions(res?.data?.filteredTransactions ?? []);
        }).catch(err => {
            toast.error(err.message)
        })
        
    }


    return <div className="w-100 p-2">

        {showButton && (
        <div className="w-100 mb-2 pb-1 flex justify-end">
            <button
                className="border-1 rounded-md me-1 flex p-1 font-medium shadow-sm"
                style={{ fontSize: 15 }}
                onClick={()=>navigate('/addTransaction')}>
                <span className="me-1">Add Transaction</span>
                <span style={{ fontSize: 20 }}><GiReceiveMoney /></span>
            </button>
        </div>)}
        
        <div className="w-100 border-1 rounded-t-md">

            <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                Monthly Transactions(Collected Rent)
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

                <div className="w-100">

                    {transactions.map((element, index) => (
                        <div
                        key={`Tenant${index}`}
                        className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${smallScreen ? "h-16 text-sm" : "h-20"
                        }`}>

                        <span style={{width:"20%"}}>{element.tenantName}</span>
                        <span style={{width:"20%"}}>{element.propertyName}</span>
                        <span style={{width:"20%"}} className="text-green-500">+ {element.recivedAmount}</span>

                        <a style={{width:"14%"}} href={`https://wa.me/${element.tenantPhoneNumber}?text=Hi`}>
                            <MdOutlineWhatsapp className="text-2xl text-green-500"/>
                        </a>
                        
                    </div>
                    ))}

                </div>
           

                <div></div>

            </div>

        </div>
    </div>
}