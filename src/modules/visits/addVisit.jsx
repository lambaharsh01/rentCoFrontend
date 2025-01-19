//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header";
import Footer from "../../components/footer";

import SearchableSelect from "../../components/searchableSelect";

import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import formatDate from "../../utils/formatDate";

import Switch from "../../components/switch";

import { getTenantDetails } from "../../utils/redux/reduxInterceptors";

import { IoCalendar } from "react-icons/io5";
import { MdCallMerge } from "react-icons/md";


export default function AddVisit() {

  const navigate = useNavigate();

  const [tenantDetails, setTenantDetails] = useState([]);
  const [visitDate, setVisitDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));

  useEffect(() => { 
    setTenantDetails(getTenantDetails() ?? [])
  }, []);

  const [selectedTenant, setSelectedTenant] = useState(false);

  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

  const [groupId, setGroupId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [rentAmount, setRentAmount] = useState(0);
  const [electricityAmountPerUnit, setElectricityAmountPerUnit] = useState(0);

  const [previousReading, setPreviousReading] = useState("");
  const [currentReading, setCurrentReading] = useState("");

  const [totalUnits, setTotalUnits] = useState(0);
  const [electricityBill, setElectricityBill] = useState(0);

  const [previouslyPending, setPreviouslyPending] = useState(true);
  const [previouslyPendingAmount, setPreviouslyPendingAmount] = useState("");

  const [damages, setDamages] = useState(false);
  const [damagesExplained, setDamagesExplained] = useState("");

  const [remark, setRemark] = useState("");

  const [lastVisitDate, setLastVisitDate] = useState("");
  const [lastVisitTotal, setLastVisitTotal]= useState("");
  const [lastVisitReading, setLastVisitReading] = useState("");
  const [previouslyRecivedAmount, setPreviouslyRecivedAmount] = useState("");
  const [fetchedPreviousVisitDetails, setFetchedPreviousVisitDetails] = useState(false);

  const fetchLastVisitData=()=> {
    if(fetchedPreviousVisitDetails) return;

    axiosInterceptor({
            url: "/api/visit/getLastVisitInfo",
            method: "get",
            query: {tenantId}
    }).then(res => {

          setLastVisitDate(formatDate(res?.data?.lastVisit?.visitDate, 'dd-mm-yyyy'));
          setLastVisitTotal(res?.data?.lastVisit?.totalRent);
          setLastVisitReading(res?.data?.lastVisit?.currentReading);
          setPreviouslyRecivedAmount(res?.data?.recivedAmount);
          setFetchedPreviousVisitDetails(true);
      
        }).catch(err => {
            toast.error(err.message);
        })


  }

  const handleTenantSelection = (data) => {
    setGroupId(data.groupId);
    setTenantId(data.tenantId);
    setTenantName(data.tenantName);
    setPropertyName(data.propertyName)
    setTenantPhoneNumber(data.tenantPhoneNumber)    
    setRentAmount(data.rentAmount);
    
    setElectricityAmountPerUnit(data.electricityAmount ?? "N/A");

    let electricityApplicability = data.electricityAmount ? "":"N/A" ;
    setPreviousReading(electricityApplicability);
    setCurrentReading(electricityApplicability);
    setTotalUnits(electricityApplicability);
    setElectricityBill(electricityApplicability);

    setPreviouslyPending(true);
    setPreviouslyPendingAmount("");
    setDamages(false);
    setDamagesExplained("");
    setRemark("")
    
    setSelectedTenant(true);
    setFetchedPreviousVisitDetails(false);
  }

  const handlePreviousReadingInput = (e) => {
    let previousReadingToNumber = Number(e.currentTarget.value);
    if (previousReadingToNumber < 0) return toast.error('Reading can not be less than 0');
    
    if (currentReading && !isNaN(currentReading)) {
      let totalReadingDifference = Number(currentReading) - previousReadingToNumber;
      setTotalUnits(totalReadingDifference);
      
      let totalElectricityBill = Math.round(totalReadingDifference * Number(electricityAmountPerUnit));
      setElectricityBill(totalElectricityBill)
    }

    setPreviousReading(previousReadingToNumber);
    if (e.currentTarget.value === "") {
      setPreviousReading("")
    } 
  }
  
  const handleCurrentReadingInput = (e) => {

    let currentReadingToNumber = Number(e.currentTarget.value);
    if (currentReadingToNumber < 0) return toast.error('Reading can not be less than 0');

    if (previousReading && !isNaN(previousReading)) {
      let totalReadingDifference = currentReadingToNumber - Number(previousReading);
      setTotalUnits(totalReadingDifference);

      let totalElectricityBill = Math.round(totalReadingDifference * Number(electricityAmountPerUnit));
      setElectricityBill(totalElectricityBill)
    }
    setCurrentReading(currentReadingToNumber); 
    
    if (e.currentTarget.value === "") {
      setCurrentReading("")
    }    
  }

  const handlePreviousPendingAmountInput = (e) => {
    if (e.currentTarget.value === "") {
      setPreviouslyPendingAmount("");
    }
      
    let previouslyPendingAmountToNumber = Number(e.currentTarget.value);
    if (previouslyPendingAmountToNumber < 1) return toast.error('Pending Amount can not be less than 1');

    setPreviouslyPendingAmount(previouslyPendingAmountToNumber)
  }

  const validateVisit = () => {

    if (!groupId) return toast.error("Group id not found.");
    if (!tenantId) return toast.error("Tenant id not found.");
    if (!tenantName) return toast.error("Tenant's name not found.");
    if (!tenantPhoneNumber) return toast.error("Tenant's phone pumber not found.");

    if (!rentAmount) return toast.error("Rent Amount not found.");
    if (!propertyName) return toast.error("Property name not found.");

    if (electricityAmountPerUnit) {
      if (previousReading === "") return toast.error("Enter previous meter reading");
      
      if (previousReading < 0) return toast.error("Previous reading can not be less than 0.");

      if (currentReading === "") return toast.error("Enter current meter reading");
      if (currentReading < 0) return toast.error("Current reading can not be less than 0.");

      if (totalUnits==="") return toast.error("total units consumed could not be obtained");
      if (totalUnits < 0) return toast.error("total units consumed could not be less than 0");
    }
    
    if (previouslyPending) {
      if (!previouslyPendingAmount || Number(previouslyPendingAmount) < 0) return toast.error("Invalid previously pending amount");
    }

    if (damages) {
      if (damagesExplained.length < 10) return toast.error("Please make sure the damage is explained in more than 10 characters");
    }


    let electricityBillAmount = electricityAmountPerUnit ? Number(electricityBill) : 0;
    
    let currentMonthTotalRent = Number(rentAmount) + electricityBillAmount;

    let totalRent = currentMonthTotalRent + Number(previouslyPendingAmount);

    let confirmationText = `Please Confirm Your Visit Data.
    `;

    if (electricityAmountPerUnit) {
      confirmationText += `
Total Units Consumed: ${totalUnits}
Total Electric Bill: ${electricityBill}`;
    } else {
      confirmationText +=`
Total Units Consumed: N/A
Total Electric Bill: N/A`;
    }

    if (previouslyPending)
      confirmationText += `
Previously Pending Amount: ${previouslyPendingAmount}`;
    
    confirmationText += `
Current Month's Total Rent: ${currentMonthTotalRent}
Total Rent(Current + Previous): ${totalRent}`;
    

    let confirmation = window.confirm(confirmationText);

    
    if (confirmation) {

      setCreateButtonDisabled(true);

      let bodyParameters = { groupId, tenantId, tenantName, tenantPhoneNumber, propertyName, rentAmount, electricityAmountPerUnit, previousReading, currentReading, totalUnits, electricityBill:electricityBillAmount, previouslyPending, previouslyPendingAmount, damages, damagesExplained, remark, currentMonthTotalRent, totalRent, visitDate };

      axiosInterceptor({
        url: "/api/visit/addVisit",
        method: "post",
        data: bodyParameters,
      }).then(res => {

        if (res.success) {
          toast.success(res.message);
          return navigate("/dashboard", { replace: true });
        } else {

          let confirmReplace = window.confirm(res.message);
          if (confirmReplace) {

            bodyParameters.confirmation = true;

            axiosInterceptor({
              url: "/api/visit/addVisit",
              method: "post",
              data: bodyParameters,
            }).then(res => {
              toast.success(res.message);
              return navigate("/dashboard", { replace: true });
            }).catch(error => {
                toast.error("Visit entry could not be created due to network issues please try again after some time.");
                return navigate("/dashboard", { replace: true });
            })

          } else {
            toast.info("Proccess Aborted");
            return navigate("/dashboard", { replace: true });
          }

          
        }
      }).catch(error => {
        toast.error("Visit entry could not be created due to network issues please try again after some time.");
        return navigate("/dashboard", { replace: true });
      }) 
    }
  }

  const mergePreviousVisitData = () => {
 
    const lastMonthPending = Number(lastVisitTotal) - Number(previouslyRecivedAmount)

    setPreviousReading(lastVisitReading)

    if (lastMonthPending > 0) {
      setPreviouslyPendingAmount(lastMonthPending)
    } else {
      setPreviouslyPending(false)
    }

    toast.success("Previous visit data merged")
}


  return (
    <div className="min-h-screen flex flex-col">
      <Header active="d" key="Header"/>

      <div className="flex-grow">
        <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
          <h1 className="rentCoFont text-3xl ps-2">
              Add Visit
          </h1>
        </div>

        <div className="col-md-10 offset-md-1 bg-white p-2">
          
          <span className="font-bold ms-2">Select Tenant Name</span>
    
          <SearchableSelect
          key="SelectTenant"
          options={tenantDetails}
          onChange={handleTenantSelection}
          inputClass="px-3 py-2 mb-4 rounded-md TeST w-100 bg-slate-100 mt-2"
          inputPlaceHolder="Select Tenant"
          />


          
          <span className="font-bold ms-2">Visit Date</span>
    
          <input
              type="date"
              className="px-3 py-2 mb-4 rounded-md TeST w-100 bg-slate-100 mt-2"
              value={visitDate}
              onChange={(e) => { setVisitDate(e.currentTarget.value) }}
              />
          

            {selectedTenant && (<div className="w-100 mt-2">

                <details className="border-2 rounded-md py-2 mb-4">
                  <summary className="list-none ps-2">
                <span
                  className="text-base font-semibold flex"
                  onClick={fetchLastVisitData}
                >
                  <IoCalendar className="text-xl me-2" /> 
                  Search For Past Visits
                </span>
                </summary>
                
              <div className="ps-9 mt-2">
                <span className="text-sm font-medium">Last Month's Visit Date: <b>{lastVisitDate}</b></span>
                <br />
                <span className="text-sm font-medium">Last month's total: <b>{lastVisitTotal}</b></span>
                <br />
                <span className="text-sm font-medium">Last month's meter reading: <b>{lastVisitReading}</b></span>
                <br />
                <span className="text-sm font-medium">Recived amount from last visit: <b>{previouslyRecivedAmount}</b></span>

                <div className="w-100 flex justify-end">
                  <MdCallMerge className="text-3xl me-2 text-green-800" onClick={mergePreviousVisitData}/>
                </div>

                </div>

                </details>

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

              <div className="mb-4">
                <span className="font-bold text-2xl">Rent Amount</span>
                <br />
                <span className="font-medium text-xl text-slate-500 ps-1">{rentAmount}</span>
              </div>

              <div className="mb-4">
                <span className="font-bold text-2xl">Electic Unit Amount</span>
                <br />
                <span className="font-medium text-xl text-slate-500 ps-1">{electricityAmountPerUnit}</span>
              </div>

              <div className="mb-4">
                <span className="font-bold text-2xl">Previous Meter Reading</span>
                {previousReading === "N/A" ? (
                  <span className="font-medium text-xl text-slate-500 ps-1">
                    <br />
                    {previousReading}</span>
                  ) : (<>
                  <input
                    type="number"
                    className="px-3 py-2 mt-1 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Previous Meter Readings"
                    value={previousReading}
                    onChange={handlePreviousReadingInput}
                  />
                </>
                )}
              </div>
    
              <div className="mb-4">
                <span className="font-bold text-2xl">Current Meter Reading</span>
                {currentReading === "N/A" ? (
                  <span className="font-medium text-xl text-slate-500 ps-1">
                    <br />
                    {currentReading}</span>
                ) : (
                  <input
                    type="number"
                    className="px-3 py-2 mt-1 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Current Meter Reading"
                    value={currentReading}
                    onChange={handleCurrentReadingInput}
                  />
                )}
              </div>

              <div className="mb-4">
                <span className="font-bold text-2xl">Total Units Consumed</span>
                <br />
                <span className="font-medium text-xl text-slate-500 ps-1">{totalUnits}</span>
              </div>

              <div className="mb-4">
                <span className="font-bold text-2xl">Total Electricity Bill</span>
                <br />
                <span className="font-medium text-xl text-slate-500 ps-1">{electricityBill}</span>
              </div>

              <div className="mb-4">
                <span className="font-bold text-2xl">Pending Balance ?</span>
                <br />
                <span className=""><Switch onChange={(boolian) => setPreviouslyPending(boolian)} checked={previouslyPending} /></span>
              </div>

              {previouslyPending && (
                <div className="mb-4">
                  <span className="font-bold text-2xl">Pending Amount</span>
                  <input
                    type="number"
                    className="px-3 py-2 mt-1 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Enter Previously Pending Amount"
                    value={previouslyPendingAmount}
                    onChange={handlePreviousPendingAmountInput}
                  />
                </div>
              )}
            
              <div className="mb-4 pt-2">
                <span className="font-bold text-2xl">Noticed Any Damages ?</span>
                <br />
                <span className=""><Switch onChange={(boolian) => setDamages(boolian)} checked={damages} /></span>
              </div>

              {damages && (
                <div className="mb-4 pt-2">
                  <span className="font-bold text-2xl">Explaination of the Damage</span>
                  <textarea
                    className="px-3 py-2 mt-1 text-sm rounded-md TeST w-100 bg-slate-100"
                    placeholder="Explain the Damage"
                    value={damagesExplained}
                    onChange={(e) => setDamagesExplained(e.currentTarget.value)}
                    rows={2}
                  ></textarea>
                </div>
              )}
            
              <div className="mb-4 ">
                <span className="font-bold text-2xl">Remarks</span>
                <textarea
                  className="px-3 py-2 mt-1 text-sm rounded-md TeST w-100 bg-slate-100"
                  placeholder="Enter Remarks (optional)"
                  value={remark}
                  onChange={(e) => setRemark(e.currentTarget.value)}
                  rows={2}
                ></textarea>
              </div>
          
          <button
            className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 py-2 w-100"
              onClick={validateVisit}
              disabled={createButtonDisabled}>
            Add Visit
          </button> 
              
              </div>
            </div>)}
          
        </div>
      </div>

      <Footer active="d" key="Header"/>
    </div>
  );
}
