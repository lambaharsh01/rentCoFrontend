import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import axiosInterceptor from "../../utils/axiosInterceptor";
import SearchableSelect from "../searchableSelect";

import { currentMinusNMonth } from "../../utils/time";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function ElectricityConsumptionGraph({graphHeading=""}){


    const [loading, setLoading] = useState(false)
    const currentMinusNMonthDates = currentMinusNMonth(6)
    const [searchFrom, setSearchFrom] = useState(currentMinusNMonthDates.fromDate)
    const [searchTo, setSearchTo] = useState(currentMinusNMonthDates.toDate)

    const [selectedTimeLine, setSelectedTimeLine] = useState({label:"Monthly", value:"month"})
    const timeFilter = [
        {label:"Monthly", value:"month"},
        {label:"Yearly", value:"year"},
    ]
    
    
    const [graphData, setGraphData] = useState([])
    const fetchBaseGraph = () => {
    
        setLoading(true)
        axiosInterceptor({
            url: "/api/analytics/getElectricityConsumptionDatasets",
            method: "get",
            query: {timeAgg:selectedTimeLine.value, fromDate: searchFrom, toDate: searchTo}
        }).then(res => {
            
            setGraphData(res.data.dataSets ?? [])
            setLoading(false)

        }).catch(err => {
            toast.error(err.message);
            setLoading(false)
        })
    }

    useEffect(()=>{
        fetchBaseGraph()
    }, [])





  return <div className="w-100 p-2 mt-3">
        
        <div className="w-100 border-1 rounded-md">

                <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                    Electricity Consumption Trends 
                </div>

      
    <div className="w-100">
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
                        <span className="text-sm font-light">Time Line</span>
                        <br />
                        <SearchableSelect
                            inputClass="w-100 p-0.5 rounded-xs bg-slate-100 border-1 mb-2"
                            options={timeFilter}
                            inputPlaceHolder={selectedTimeLine.label}
                            onChange={(obj)=>{setSelectedTimeLine(obj)}}
                        />
                    </div>
                                            
                    <div className="w-2/5 pt-4">
                              <button
                                  className="w-100 p-0.5 text-white rounded-sm bg-black btn-sm w-100 mb-2"
                                  onClick={() => {
                                      fetchBaseGraph()
                                  }}
                            disabled={loading}
                        >Search</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="text-center py-1 font-bold mb-2">
        {graphHeading || selectedTimeLine.label + " Electricity Consumption Trends"}
    </div>
    {graphData.length ? (
        <>
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="units" stroke="#1E90FF" fill="#7DF9FF" />
            </AreaChart>
        </ResponsiveContainer>
        </>
    ) : (
        <div className="w-100 text-center mb-3">
            <span className="text-sm font-light text-center">No Data Found</span>
        </div>
    )}

    </div>   
    </div>   

}