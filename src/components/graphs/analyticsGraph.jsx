

import { toast } from "react-toastify";

import axiosInterceptor from "../../utils/axiosInterceptor";
import SearchableSelect from "../searchableSelect";

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
import { useCallback, useEffect, useState } from "react";


export default function AnalyticsGraph({graphHeading=""}){

    const [loading, setLoading] = useState(false)
    const currentMinusNMonthDates = currentMinusNMonth(6)
    const [searchFrom, setSearchFrom] = useState(currentMinusNMonthDates.fromDate)
    const [searchTo, setSearchTo] = useState(currentMinusNMonthDates.toDate)

    const [selectedTimeLine, setSelectedTimeLine] = useState({label:"Monthly", value:"month"})
    const timeFilter = [
        {label:"Monthly", value:"month"},
        {label:"Yearly", value:"year"},
    ]

    
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
    const fetchBaseGraph = useCallback(()=> {
        setLoading(true)
        axiosInterceptor({
            url: "/api/analytics/getAnalyticsGraphicalDatasets",
            method: "get",
            query: {timeAgg:selectedTimeLine.value, fromDate: searchFrom, toDate: searchTo}
        }).then(res => {
            
            setTotalGraph(res.data.dataSets ?? [])
            setLoading(false)

        }).catch(err => {
            toast.error(err.message);
            setLoading(false)
        })
    }, [selectedTimeLine, searchFrom, searchTo])


    const [activeGroupTabIndex, setActiveGroupTabIndex] = useState(-1);
    const [groupTabs, setGroupTabs] = useState([]);

    const fetchGroupData = useCallback(() =>{
        axiosInterceptor({
            url: "/api/group/getAllGroups",
            method: "get",
        }).then((res) => {
          let groups = res?.data?.groups || [] 
          groups.map(elem=>{ return {groupId:elem._id, groupName:elem.groupName} })
          setGroupTabs(groups)
        })
        .catch((error) => toast.error(error.message));
        
    }, [])



    useEffect(()=>{
        fetchBaseGraph()
        fetchGroupData()
    }, [fetchBaseGraph, fetchGroupData])


    const [groupGraph, setGroupGraph] = useState([])
    const fetchGroupGraph = ()=> {

        alert(activeGroupTabIndex)
        const groupId = groupTabs[activeGroupTabIndex]?.groupId
alert(groupId)
    
        if(!groupId) return 

        setLoading(true)
        axiosInterceptor({
            url: "/api/analytics/getAnalyticsGraphicalDatasets",
            method: "get",
            query: {timeAgg:selectedTimeLine.value, fromDate: searchFrom, toDate: searchTo, groupId}
        }).then(res => {
            
            setGroupGraph(res.data.dataSets ?? [])
            setLoading(false)

        }).catch(err => {
            toast.error(err.message);
            setLoading(false)
        })
    }




  return <div className="w-100 p-2 mt-3">
        
        <div className="w-100 border-1 rounded-md">

                <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                    Analytical Report 
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
                            onClick={()=>fetchBaseGraph()}
                            disabled={loading}
                        >Search</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="text-center py-1 font-bold mb-2">
        {graphHeading || selectedTimeLine.label + " Rent Report"}
    </div>
    {totalGraph.length ? (
        <>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
            data={totalGraph}
            margin={{ top: 10, right: 20, left: 4, bottom: 28 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                trigger="click"
                formatter={(value, name) => [
                    value,
                    formatLabel(name),
                  ]}/>
                <Legend formatter={(value) => formatLabel(value)}/>
                <Line type="monotone" dataKey="totalRent" stroke="#ff7f50" strokeWidth={2} />
                <Line type="monotone" dataKey="totalRentPaid" stroke="#2ecc71" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>

    <div className="w-full">
      <div className="w-full flex border-gray-200 overflow-x-auto">
        {groupTabs.map((tab, index) => (
          <div
            key={index}
            className={`px-3 pt-1 pb-2 rounded-t-lg font-medium min-w-max ${
                activeGroupTabIndex === index
                ? "bg-black text-light"
                : "bg-white border-t-2 border-x-2"
            }`}
            onClick={() => {
                setActiveGroupTabIndex(index)
                fetchGroupGraph()
            }}
          >
            {tab.groupName}
          </div>
        ))}
      </div>
      <div className="border-b-2 border-x-2 rounded-b-lg">
        <br />
        {groupGraph.length ? (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
            data={groupGraph}
            margin={{ top: 10, right: 20, left: 4, bottom: 28 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                trigger="click"
                formatter={(value, name) => [
                    value,
                    formatLabel(name),
                  ]}/>
                <Legend formatter={(value) => formatLabel(value)}/>
                <Line type="monotone" dataKey="totalRent" stroke="#ff7f50" strokeWidth={2} />
                <Line type="monotone" dataKey="totalRentPaid" stroke="#2ecc71" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    ) : (
        <div className="w-100 text-center mb-3">
            <span className="text-sm font-light text-center">No Data Found</span>
        </div>
    )}
        
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md">
      </div>
    </div>







        </>
    ) : (
        <div className="w-100 text-center mb-3">
            <span className="text-sm font-light text-center">No Data Found</span>
        </div>
    )}

    </div>   
    </div>   

}