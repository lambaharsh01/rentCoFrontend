import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import axiosInterceptor from "../../utils/axiosInterceptor";

import { currentMinusNMonth } from "../../utils/time";



import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function MonthlyRentTrends(){


    const formatLabel = (str)=>{
        switch(str){
            case "totalRent" :
                return "Total Rent"
            case "totalRentPaid":
                return "Total Rent Paid"
            default:
                return str
        }
    }
    const [totalGraph, setTotalGraph] = useState([])
    const fetchBaseGraph = () => {
        const { fromDate, toDate } = currentMinusNMonth(6)
        axiosInterceptor({
            url: "/api/analytics/getAnalyticsGraphicalDatasets",
            method: "get",
            query: {timeAgg:"month", fromDate, toDate}
        }).then(res => {
            setTotalGraph(res.data.dataSets ?? [])
        }).catch(err => {
            toast.error(err.message);
        })
    }

    useEffect(()=>{
        fetchBaseGraph()
    }, [])

    if(!totalGraph.length) return 

    return <div className="w-100 p-2 mb-2">
        
        <div className="w-100 border-1 rounded-md">

        <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
            Monthly Rent Trends
        </div>
            
         <div className="text-center py-1 font-bold my-2">
            {(totalGraph[0]?.label || "") + " - " + (totalGraph[totalGraph.length - 1]?.label || "")}
        </div>
            
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
            data={totalGraph}
            margin={{ top: 10, right: 20, left: 4, bottom: 28 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                // trigger="click"
                formatter={(value, name) => [
                    value,
                    formatLabel(name),
                  ]}/>
                <Legend formatter={(value) => formatLabel(value)}/>
                <Line type="monotone" dataKey="totalRent" stroke="#ff7f50" strokeWidth={2} />
                <Line type="monotone" dataKey="totalRentPaid" stroke="#2ecc71" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>

    </div>   
    </div>   

}