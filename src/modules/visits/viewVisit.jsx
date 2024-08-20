//react
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//components
import Header from "../../components/header";

//ui
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

//function
import axiosInterceptor from "../../utils/axiosInterceptor";
import formatDate from "../../utils/formatDate";


export default function ViewVisit() {
  const navigate = useNavigate();
  const params = useParams();
  const { visitId } = params;


  const [tenantName, setTenantName] = useState("");
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");

  const [rentAmont, setRentAmount] = useState("");
  const [visitDate, setVisitDate] = useState("");
  
  const [electricityAmountPerUnit, setElectricityAmountPerUnit] = useState("");
  const [previousReading, setPreviousReading] = useState("")
  const [currentReading, setCurrentReading] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [electricityBill, setElectricityBill] = useState("");
  const [previouslyPending, setPreviouslyPending] = useState(false);
  const [previouslyPendingAmount, setPreviouslyPendingAmount] = useState("");
  const [damages, setDamages] = useState(false);
  const [damagesExplained, setDamagesExplained] = useState("");
  const [remark, setRemark] = useState("");
  const [currentMonthTotalRent, setCurrentMonthTotalRent] = useState("");
  const [totalRent, setTotalRent] = useState("");

  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  
  const fetchVisit = useCallback(() => {

    setLoading(true);

    axiosInterceptor({
      url: "/api/visit/getVisitInfo",
      method: "get",
      query: { visitId },
    }).then(res => {
      
      let visit = res?.data?.visit ?? {};

      setTenantName(visit?.tenantName ?? "");
      setTenantPhoneNumber(visit?.tenantPhoneNumber ?? "");
      setPropertyName(visit?.propertyName ?? "");
      setRentAmount(visit?.rentAmount ?? "");
      setElectricityAmountPerUnit(visit?.electricityAmountPerUnit ?? "N/A");
      setPreviousReading(visit?.previousReading ?? "N/A");
      
      setCurrentReading(visit?.currentReading ?? "N/A");
      setTotalUnits(visit?.totalUnits ?? "N/A");
      setElectricityBill(visit?.electricityBill ?? "N/A");
      setPreviouslyPendingAmount(visit?.previouslyPendingAmount ?? "");
      setDamagesExplained(visit?.damagesExplained ?? "");
      setRemark(visit?.remark ?? "N/A");
      setCurrentMonthTotalRent(visit?.currentMonthTotalRent ?? "");
      setTotalRent(visit?.totalRent ?? "");
      
      setDamages(visit.damages)
      setPreviouslyPending(visit.previouslyPending)
      setVisitDate(formatDate(visit?.visitDate, 'dd-mm-yyyy'));
      setCreatedAt(formatDate(visit?.createdAt, 'dd-mm-yyyy'));

      setLoading(false)
      
    }).catch(err => {
      toast.error(err.message);
      navigate("/dashboard");
    })

  }, [visitId, navigate]);

  
  useEffect(() => {
    fetchVisit();
  }, [fetchVisit]);
  



  return (
    <div className="min-h-screen">
      <Header active="d" />

      <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
        <h1 className="rentCoFont mainFont text-4xl ps-2">
          <span className="outlined-text-thin text-white">Visit Details</span>
        </h1>
      </div>

      <div className="col-md-10 offset-md-1 bg-white p-2">


        {loading ? (
        <div>
            <Skeleton count={6} height={60} className="mb-3" />
        </div>
        ): (
          <div className="p-2 w-100">

            <div className="mb-4">
              <span className="font-bold text-2xl">Tenant Name</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{tenantName}</span>
            </div>

            <div className="mb-4">
              <span className="font-bold text-2xl">Property</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{propertyName}</span>
            </div>

            <div className="mb-4">
              <span className="font-bold text-2xl">Tenant Contact</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{tenantPhoneNumber}</span>
          </div>

          
            <div className="mb-3">
              <span className="font-bold text-2xl">Rent Amount</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{rentAmont}</span>
            </div>
          
            <div className="mb-3">
              <span className="font-bold text-2xl">Electricity Amount(Per Unit)</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{electricityAmountPerUnit}</span>
            </div>
          
            <div className="mb-3">
              <span className="font-bold text-2xl">Pervious Meter Reading</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{previousReading}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Current Meter Reading</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{currentReading}</span>
          </div>
        
          <div className="mb-3">
            <span className="font-bold text-2xl">Total Electrical Units Consumed</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{totalUnits}</span>
          </div>
          
        
          <div className="mb-3">
            <span className="font-bold text-2xl">Total Electricity Bill</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{electricityBill}</span>
          </div>

          {
    previouslyPending && (
      <div className="mb-3">
        <span className="font-bold text-2xl">Previously Pending Amount</span>
        <br />
        <span className="font-medium text-xl text-slate-500 ps-1">{previouslyPendingAmount}</span>
      </div>
    )
  }

  {
    damages && (
      <div className="mb-3">
        <span className="font-bold text-2xl">Damages</span>
        <br />
        <span className="font-medium text-xl text-slate-500 ps-1">{damagesExplained}</span>
      </div>
    )
  }

          <div className="mb-3">
            <span className="font-bold text-2xl">Remarks</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{remark}</span>
          </div>

          <div className="mb-3">
            <span className="font-bold text-2xl">Current Month's Total Rent</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{currentMonthTotalRent}</span>
          </div>

          <div className="mb-3">
            <span className="font-bold text-2xl">Total Rent {previouslyPending && (<span>Current + Previous</span>)}</span>
            <br />
            <span className="font-medium text-xl text-slate-500 ps-1">{totalRent}</span>
          </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Visit Date</span>
              <br />
           <span className="font-medium text-xl text-slate-500 ps-1">{visitDate}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Visit Creation Date</span>
              <br />
           <span className="font-medium text-xl text-slate-500 ps-1">{createdAt}</span>
            </div>

          </div >
        )}

      </div>
    </div>
  );
}
