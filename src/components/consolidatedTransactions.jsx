import { useEffect, useState } from "react"

// pdf download
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IoIosDownload } from "react-icons/io";

//import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";
import SearchableSelect from "./searchableSelect";

import Skeleton from "react-loading-skeleton";


import { getTenantDetails } from "../utils/redux/reduxInterceptors";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

//let monthBoundary= getCurrentMonthBoundaries();

export default function ConsolidatedTransactions({ nameLabel="Select Tenant", id="", fromDate="", toDate=""}) {

    const [consolidatedReport, setConsolidatedReport] = useState([]);
    
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

        // if(id){
        //     fetchData({ fromDate: "", toDate: "", tenantId:id});
        // }

    }, []);
    
    const handleTenanSelection = (e) => {
        setTenantName(e.label);
        setTenantId(e.tenantId);
    }

    const searchTenants = () => {
        fetchData({ fromDate: searchFrom, toDate: searchTo, tenantId});
    }

    function fetchData(object) {

        if (!tenantId) return toast.error("No tenant has been selected.");
        
        setLoading(true);
        axiosInterceptor({
            url: "/api/analytics/getConsolidatedReport",
            method: "get",
            query: object
        }).then(res => {
        // consolidatedReport, setConsolidatedReport
            setConsolidatedReport(res?.data?.consolidatedReport ?? []);
            setSearched(true);
            setLoading(false);
            toast.success("Data fetched for "+tenantName);
        }).catch(err => {
            toast.error(err.message);
            setSearched(true);
            setLoading(false);
        })
        
    }


    const totalOfConsolidationReport = (ary) => {

        const array=structuredClone(ary)

        const lastIndex = array.length - 1 - [...array].reverse().findIndex(el => el?.src === "visit");

        if (lastIndex === -1) return 0;
        
        let newArray = array.splice(lastIndex);

         return newArray.reduce((accumulator, currentItem) => accumulator + currentItem.value, 0)
    }

    const exportPDF = (ary) => {
        const array= structuredClone(ary)
        const doc = new jsPDF();

        // Define the columns and rows for the table
        const pdfHead = ["Total", "Date", "Monthly Rent", "Previously Pending", "Electricity Bill", "Total Units", "Cost per/unit", "Current Unit", "Previous Unit"];
    
        const pdfBody = array.map((element, index) => {
            console.log(index, "element")
            
            if (element.src !== "visit") return [
                "+" + element.recivedAmount,
                element.dateFormat,
                "", "", "", "", "", "", ""
            ];

            return [
                "-" + element.totalRent,
                element.dateFormat,
                element.rentAmount,
                element.previouslyPendingAmount ? element.previouslyPendingAmount : "N/A",
                element.electricityBill ? element.electricityBill : "N/A",
                element.totalUnits,
                element.electricityAmountPerUnit ? element.electricityAmountPerUnit : "N/A",
                element.currentReading,
                element.previousReading
            ];
        });

        pdfBody.push([
            "Total(" + (-totalOfConsolidationReport(array) ) + ")", "", "", "", "", "", "", "", ""
        ])
        
    doc.autoTable({
      head: [pdfHead],
      body: pdfBody,
    });

    doc.save('TenantReport.pdf');
  };



    return <div className="w-100 p-2 mt-3">
        
        <div className="w-100 border-1 rounded-md">

                <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                    Consolidated Report
                    <br />
                    <span className="text-xs">(Consolidated report could only be generated for individual tenants)</span>
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
                        {!id && (
                        <div className="w-2/5">
                        <span className="text-sm font-light">Tenant</span>
                                <br />
                                <SearchableSelect
                                    inputClass="w-100 p-0.5 rounded-xs bg-slate-100 border-1 mb-2"
                                    options={tenantOptions}
                                    inputPlaceHolder={tenantName}
                                    onChange={handleTenanSelection}
                                />

                        </div>
                        )}
                                                        
                        <div className={`${!id ? "w-2/5":"w-11/12"} pt-4`}>
                                <button
                                    className="p-0.5 text-white rounded-sm bg-black btn-sm w-100 mb-2"
                                    onClick={searchTenants}
                                    disabled={loading}
                                >Search</button>
                        </div>
                        </div>
                    </div>

                </div>
                
                <div className="border-y-2 mt-2 text-center">
                    <div className="px-2 py-2 flex justify-center bg-slate-200 relative">
                        <span className="me-2 font-semibold text-sm">
                            {searched ?
                                (<span className="w-100 flex items-center">
                                    Transaction Report
                                    <IoIosDownload
                                        className="text-3xl absolute right-1"
                                        onClick={()=>exportPDF(consolidatedReport)}
                                    />
                                </span>) :
                                (<span>Please Select Tenant And Search</span>)
                            }
                        </span>
                    </div>
                </div>

                <div className="w-100 scrolMaxHeight3000 px-1 flex justify-center">
                    <div className="table-responsive py-3">
                        <table className={` ${searched ? "d-block" : "d-none"}`}>
                            <thead>
                                <tr className="bg-slate-200">
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Monthly Rent</th>
                                    <th>Previously Pending</th>
                                    <th>Electricity Bill</th>
                                    <th>Total Units</th>
                                    <th>Cost per/unit</th>
                                    <th>Current Unit</th>
                                    <th>Previous Unit</th>
                                </tr>
                            </thead>
                           
                                {searched && !consolidatedReport.length && (
                                    <tr className="text-center">
                                        <td colSpan={9}>No Data Exists</td>
                                    </tr>
                                )}

                    
                            {loading ? (
                                <tbody>
                                <tr>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                    <td><Skeleton count={3} height={30} className="mb-2" /></td>
                                </tr>
                                </tbody>
                            ) : (<tbody>
                                    {consolidatedReport.map((element, index) => {

                                        if (element.src !== "visit") return (
                                            <tr key={`consolidation${index}`} >
                                                <td className="text-green-500"> + {element.recivedAmount}</td>
                                                <td>{element.dateFormat}</td>
                                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                            </tr>
                                        )

                                        return (<tr key={`consolidation${index}`} >
                                            <td className="text-red-500"> - {element.totalRent}</td>
                                            <td>{element.dateFormat}</td>
                                            <td>{element.rentAmount}</td>
                                            {
                                                element.previouslyPendingAmount ?
                                                    (<td>{element.previouslyPendingAmount}</td>) :
                                                    (<td>N/A</td>)
                                            }
                                            {
                                                element.electricityBill ?
                                                    (<td>{element.electricityBill}</td>) :
                                                    (<td>N/A</td>)
                                            }
                                            <td>{element.totalUnits}</td>
                                            {
                                                element.electricityAmountPerUnit ?
                                                    (<td>{element.electricityAmountPerUnit}</td>) :
                                                    (<td>N/A</td>)
                                            }
                                            <td>{element.currentReading}</td>
                                            <td>{element.previousReading}</td>
                                        </tr>)
        
                                    })}


                                    <tr>
                                        <td colSpan={9} className="font-bold">
                                        Total
                                          (-{totalOfConsolidationReport(consolidatedReport)})
                                        </td>
                                    </tr>
                            </tbody>)
                            }
  
                        </table>
                    </div>

                </div>
           
            </div>

        </div>
    </div>
}
