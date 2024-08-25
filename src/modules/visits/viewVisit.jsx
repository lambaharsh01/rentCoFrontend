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
              
              <table className="w-100 font-medium border-y-2">
                <tr>
                    <td className="w-2/5 py-2">Tenant Name</td>
                    <td className="w-3/5 border-b-2 py-2">{tenantName}</td>
                </tr>
                <tr>
                    <td className="w-2/5 py-2">Property</td>
                    <td className="w-3/5 border-b-2 py-2">{propertyName}</td>
                </tr>
                <tr>
                    <td className="w-2/5 py-2">Tenant Contact</td>
                    <td className="w-3/5 border-b-2 py-2">{tenantPhoneNumber}</td>
                </tr>
                <tr>
                    <td className="w-2/5 py-2">Rent Amount</td>
                    <td className="w-3/5 border-b-2 py-2">{rentAmont}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Electricity Amount<br />(Per Unit)</td>
                    <td className="w-3/5 border-b-2 py-2">{electricityAmountPerUnit}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Pervious Meter Reading</td>
                    <td className="w-3/5 border-b-2 py-2">{previousReading}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Pervious Meter Reading</td>
                    <td className="w-3/5 border-b-2 py-2">{previousReading}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Current Meter Reading</td>
                    <td className="w-3/5 border-b-2 py-2">{currentReading}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Total Electric Units</td>
                    <td className="w-3/5 border-b-2 py-2">{totalUnits}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Total Electricity Bill</td>
                    <td className="w-3/5 border-b-2 py-2">{electricityBill}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Previously Pending Amount</td>
                    <td className="w-3/5 border-b-2 py-2">{previouslyPending ? previouslyPendingAmount : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Damages</td>
                    <td className="w-3/5 border-b-2 py-2">{damages ? damagesExplained : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Remarks</td>
                    <td className="w-3/5 border-b-2 py-2">{remark}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Current Month's Total</td>
                    <td className="w-3/5 border-b-2 py-2">{currentMonthTotalRent}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Total Rent <br /> (Previous + Current)</td>
                    <td className="w-3/5 border-b-2 py-2">{totalRent}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Visit Date</td>
                    <td className="w-3/5 border-b-2 py-2">{visitDate}</td>
                </tr>
                <tr>
                  <td className="w-2/5 py-2">Visit Creation Date</td>
                    <td className="w-3/5 border-b-2 py-2">{createdAt}</td>
                </tr>
              </table>
          </div >
        )}

      </div>
    </div>
  );
}
