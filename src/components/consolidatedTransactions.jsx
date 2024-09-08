import { useEffect, useState } from "react"

// pdf download
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";
import SearchableSelect from "./searchableSelect";

import Skeleton from "react-loading-skeleton";


import { getTenantDetails } from "../utils/redux/reduxInterceptors";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

let monthBoundary= getCurrentMonthBoundaries();

export default function ConsolidatedTransactions({ nameLabel="Select Tenant", id="", fromDate=monthBoundary.fromDate, toDate=monthBoundary.toDate}) {

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



    const exportPDF = () => {
    const doc = new jsPDF();
    
    // Define the columns and rows for the table
        const pdfHead = ["Total", "Date", "Monthly Rent", "Previously Pending", "Electricity Bill", "Total Units", "Cost per/unit", "Current Unit", "Previous Unit"];
        
        const pdfBody = consolidatedReport.map((element, index) => {
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
            "Total(" + (-consolidatedReport.reduce((accumulator, currentItem) => accumulator + currentItem.value, 0) ) + ")", "", "", "", "", "", "", "", ""
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
                            <button className="p-0.5 text-white rounded-sm bg-green-500 btn-sm w-100 mb-2" onClick={searchTenants} disabled={loading}>Search</button>
                        </div>
                        </div>
                    </div>

                </div>
                
                <div className="border-y-2 mt-2 text-center">
                    {searched ? (
                    <span className="font-medium">Report</span>
                    ): (
                    <div className="px-2 py-1 flex justify-center bg-slate-200">
                    <span className="me-2 font-semibold text-sm">Please Select Tenant And Search</span>
                    </div>
                    )}
                    </div>

                <div className="w-100 scrolMaxHeight300 px-1 pt-2">

                    <div  className={`w-100 text-end pt-2  ${ searched ? "d-block":"d-none"}`}>
                        <button
                            className="p-1 text-white rounded-sm bg-green-500 btn-sm"
                            onClick={exportPDF}>
                            <b>Download report</b>
                        </button>
                    </div>

                    <div className="table-responsive py-4">
                        <table className={` ${ searched ? "d-block":"d-none"}`}>
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
                           
                                {searched && !consolidatedReport.length && (
                                    <tr className="text-center">
                                        <td colSpan={9}>No Data Exists</td>
                                    </tr>
                                )}

                    
                    {loading ? (
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
                                          (-{consolidatedReport.reduce((accumulator, currentItem) => accumulator + currentItem.value, 0)})
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