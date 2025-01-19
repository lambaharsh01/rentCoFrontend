//react
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import SearchableSelect from "../../components/searchableSelect";

//components
import Header from "../../components/header";
import Footer from "../../components/footer";
import { GiReceiveMoney } from "react-icons/gi";
import ConsolidatedTransactions from "../../components/consolidatedTransactions";
// import Skeleton from "react-loading-skeleton";

// //icons
// import { MdCall } from "react-icons/md";
// // import { IoInformationCircleSharp } from "react-icons/io5";
// // import { BsThreeDotsVertical } from "react-icons/bs";
// // import { MdDelete, MdEdit } from "react-icons/md";

// //ui
import { toast } from "react-toastify";
// // import { Dropdown } from "react-bootstrap";

// //functions
// import isSmallScreen from "../../utils/isSmallScreen";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { currentDate } from "../../utils/time";

export default function PastTenantDetails() {

  const location = useLocation();
  const user = location.state;

  const navigate = useNavigate()

  const navigateTenant = () => {
    navigate("/viewTenant/" + user.tenantId)
  }

  const paymentMethodArray = [{ label: "Cash" }, { label: "Cheque" }, { label: "Online Transaction" }];
  
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [ disableAddTransaction ,setDisableAddTransaction] = useState(false)

  const [transactionDate, setTransactionDate] = useState(currentDate());
  const paymentType = "Overdue Balance"
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receivedAmount, setReceivedAmount]= useState("")
  const [remark, setRemark]= useState("")


  
    const validateSubmit = () => {
  
      if (isNaN(Date.parse(transactionDate))) return toast.error("Invalid transaction date");
      if (paymentMethod.length<4) return toast.error("Select a valid payment method");
      
      if (!receivedAmount) return toast.error("Enter recived amount");
      if (receivedAmount < 1) return toast.error("Recived amount can not be less than one");
  
      let confirmation = window.confirm(`Please confirm transaction details.
  Payment Method: ${paymentMethod}
  Payment Type: ${paymentType}
  Recived Amount: ${receivedAmount}`);
      
      if (confirmation) {
        setDisableAddTransaction(true);
  
      let data={tenantId: user.tenantId, tenantName: user.tenantName, tenantPhoneNumber: user.tenantPhoneNumber,
        propertyName: user.propertyName, paymentMethod, paymentType, 
        recivedAmount: receivedAmount ,transactionDate}
      
        axiosInterceptor({
          url: "/api/past/addOverdueTransaction",
          method: "post",
          data
        }).then(res => {
          toast.success(res.message);
          return navigate("/pastTenants", { replace: true });
        }).catch(err => {
          toast.error(err.message);
          return navigate("/pastTenants", { replace: true });
        });
      }
      
    }
  
  
    return (
    <div className="min-h-screen flex flex-col">
      <Header active="p" />
      <div className="flex-grow">
        <div className="container-fluid">
          <div className="row pt-4">
            <div className="col-12 flex justify-between items-center -mb-2">
              <h1 className="rentCoFont text-3xl ps-1.5">
                  {user?.tenantName}
              </h1>

              <span className="font-medium text-blue-400 cursorPointer"
              onClick={()=>navigateTenant()}
              > View Details {">>"} </span>

              
            </div>

            <span className="ps-2 ms-2.5 font-medium">
              Move-Out Date {user?.inactivatedAt}
            </span>

           
            </div>

            <div className="row pt-3">
              <div className="w-100 flex justify-end">
                  <button
                      className="border-1 rounded-md me-1 flex p-1 font-medium shadow-sm"
                      style={{ fontSize: 15 }}
                      onClick={()=>setShowAddTransaction(prevBool => !prevBool)}
                      >
                      <span className="me-1">Add Transaction</span>
                      <span style={{ fontSize: 20 }}><GiReceiveMoney /></span>
                  </button>
              </div>
            <div>

            {/* ADD TRANSACTION SECTION */}
            {showAddTransaction && (<div className="w-100">
              <div className="w-100 p-2 mt-3">
                <div className="w-100 border-1 rounded-md">
                  <div className="rentCoRed rounded-t-md text-center py-1 font-bold">
                      Add Transaction
                  </div>

                  <div className="w-100 p-2">
                    <div className="font-medium flex justify-end items-center p-2">
                      <div className="w-100">

                          <div className="mb-3">
                            <span className="font-medium text-base">Select Transaction Date</span>
                            <br />
                            <input
                              type="date"
                              className="px-3 py-2 rounded-md TeST w-100 bg-slate-100"
                              value={transactionDate}
                              onChange={(e) => { setTransactionDate(e.currentTarget.value) }}
                            />
                          </div>

                          <div className="mb-3">
                            <span className="font-medium text-base">Select Payment Method</span>
                            <br />
                            <SearchableSelect
                              key="SelectPaymentMethod"
                              options={paymentMethodArray}
                              onChange={(selectedMethod)=>setPaymentMethod(selectedMethod.label)}
                              inputClass="px-3 py-2 rounded-md TeST w-100 bg-slate-100"
                              inputPlaceHolder="Select Payment Method"
                            />
                          </div>

                          <div className="mb-3">
                            <span className="font-medium text-base">Enter Received Amount</span>
                            <br />
                            <input
                                type="number"
                                className="px-3 py-2 rounded-md TeST w-100 bg-slate-100"
                                placeholder="Enter Recived Amount"
                                value={receivedAmount}
                                onChange={(e)=>setReceivedAmount(e.currentTarget.value)}
                              />
                          </div>

                          <div className="mb-2">
                            <span className="font-medium text-base">Enter Remarks</span>
                            <br />
                          <textarea
                            className="px-3 py-2 mb-3 text-sm  rounded-md TeST w-100 bg-slate-100"
                            placeholder="Enter Remark (Optional)"
                            value={remark}
                            onChange={(e) => setRemark(e.currentTarget.value)}
                            rows={2}
                          ></textarea>
                          </div>

                          <button
                            className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 py-2 w-100"
                            onClick={validateSubmit}
                            disabled={disableAddTransaction}
                          >
                            Add Transaction
                          </button>
                          {/* payment type :"Overdue Balance" */}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

            
              <ConsolidatedTransactions id={user?.tenantId} nameLabel={user?.tenantName}/>

            </div>

          </div>
        </div>
      </div>
      <Footer active="p" />
    </div>
  );
}
