//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import Header from "../../components/header";
import SearchableSelect from "../../components/searchableSelect";

//ui
import { toast } from "react-toastify";

//function
import axiosInterceptor from "../../utils/axiosInterceptor";
import { getTenantDetails } from "../../utils/redux/reduxInterceptors";

export default function AddTransaction() {
  const navigate = useNavigate();

  const [tenantDetails, setTenantDetails] = useState([]);

  useEffect(() => {
    setTenantDetails(getTenantDetails() ?? [])
   }, []);

  const [selectedTenant, setSelectedTenant] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));


  const [groupId, setGroupId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const [recivedAmount, setRecivedAmount] = useState("");

  const [remark, setRemark] = useState("");

  const handleTenantSelection = (data) => {
      
    setGroupId(data.groupId);
    setTenantId(data.tenantId);
    setTenantName(data.tenantName);
    setTenantPhoneNumber(data.tenantPhoneNumber);
    setPropertyName(data.propertyName);
    setSelectedTenant(true);
  }

  const handleRecivedAmount = (e) => {
    let inputValue = e.currentTarget.value;
    if (inputValue === "") return setRecivedAmount(inputValue);

    inputValue = Number(inputValue);
    if (inputValue < 1) return toast.error("Recived amount can not be less than 1");

    return setRecivedAmount(inputValue);
  }

  const paymentMetodArray = [{ label: "Cash" }, { label: "Cheque" }, { label: "Online Transaction" }];

  const paymentTypeArray = [{ label: "Monthly Payment" }, { label: "Advance Payment" }, { label: "Security Deposit" }, { label: "Other" }];

  const [disableSubmit, setDisableSubmit] = useState(false);

  const validateSubmit = () => {

    if (!groupId) return toast.error("Group id not found can not proceed ahead");
    if (!tenantId) return toast.error("Tenant id not found can not proceed ahead");
    if (isNaN(Date.parse(transactionDate))) return toast.error("Invalid transaction date");
    if (!tenantName) return toast.error("Tenant name not found can not proceed ahead");
    if (!propertyName) return toast.error("Property name not found can not proceed ahead");
    if (paymentMethod.length<4) return toast.error("Select a valid payment metod");
    if (paymentType.length < 5) return toast.error("Select a valid payment type");
    
    if (!recivedAmount) return toast.error("Enter recived amount");
    if (recivedAmount < 1) return toast.error("Recived amount can not be less than one");

    let confirmation = window.confirm(`Please confirm transaction details.

Tenant: ${tenantName}
Property: ${propertyName}
Payment Method: ${paymentMethod}
Payment Type: ${paymentType}
Recived Amount: ${recivedAmount}`);
    
    if (confirmation) {
      setDisableSubmit(true);

    let data={groupId, tenantId, tenantName, propertyName, paymentMethod, paymentType, recivedAmount,tenantPhoneNumber,transactionDate}
    
      axiosInterceptor({
        url: "/api/transaction/addTransaction",
        method: "post",
        data
      }).then(res => {
        toast.success(res.message);
        return navigate("/dashboard", { replace: true });
      }).catch(err => {
        toast.error(err.message);
        return navigate("/dashboard", { replace: true });
      });
    }
    
  }


  return (
    <div className="min-h-screen">
      <Header active="d" />

      <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
        <h1 className="rentCoFont mainFont text-4xl ps-2">
          <span className="outlined-text-thin text-white">Add Transaction</span>
        </h1>
      </div>

      <div className="col-md-10 offset-md-1 bg-white p-2">

        <SearchableSelect
        key="SelectTenant"
        options={tenantDetails}
        onChange={handleTenantSelection}
        inputClass="px-3 py-2 mb-3 rounded-full w-100 bg-slate-100"
        inputPlaceHolder="Select Tenant"
        />

          <span className="font-bold ms-2">Transaction Date</span>
  
          <input
            type="date"
            className="px-3 py-2 mb-4 rounded-full w-100 bg-slate-100 mt-2"
            value={transactionDate}
            onChange={(e) => { setTransactionDate(e.currentTarget.value) }}
            />


        

{selectedTenant && (
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
              <span className="font-bold text-2xl">Select Payemt Method</span>
              <br />
              <SearchableSelect
                key="SelectPaymentMethod"
                options={paymentMetodArray}
                onChange={(selectedMethod)=>setPaymentMethod(selectedMethod.label)}
                inputClass="px-3 py-2 mb-3 rounded-full w-100 bg-slate-100"
                inputPlaceHolder="Select Payment Method"
              />
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Select Payemt Type</span>
              <br />
              <SearchableSelect
                key="SelectPaymentType"
                options={paymentTypeArray}
                onChange={(selectedType)=>setPaymentType(selectedType.label)}
                inputClass="px-3 py-2 mb-3 rounded-full w-100 bg-slate-100"
                inputPlaceHolder="Select Payment Type"
              />
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Enter Recived Amount</span>
              <br />
               <input
                  type="number"
                  className="px-3 py-2 mt-1 rounded-full w-100 bg-slate-100"
                  placeholder="Enter Recived Amount"
                  value={recivedAmount}
                  onChange={handleRecivedAmount}
                />
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Enter Remarks</span>
              <br />
            <textarea
              className="px-3 py-2 mb-3 text-sm  rounded-full w-100 bg-slate-100"
              placeholder="Enter Remark (Optional)"
              value={remark}
              onChange={(e) => setRemark(e.currentTarget.value)}
              rows={2}
            ></textarea>
            </div>

            <button
              className="bg-slate-950 rounded-full text-white text-lg px-md-12 py-2 w-100"
              onClick={validateSubmit}
              disabled={disableSubmit}
            >
              Add Transaction
            </button>
          </div>
)}  
      </div>
    </div>
  );
}
