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


export default function ViewTransaction() {
  const navigate = useNavigate();
  const params = useParams();
  const { transactionId } = params;


  const [tenantName, setTenantName] = useState("N/A");
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState("N/A");
  const [propertyName, setPropertyName] = useState("N/A");
  
  const [paymentMethod, setPaymentMethod] = useState("N/A");
  const [paymentType, setPaymentType] = useState("N/A");

  const [remark, setRemark] = useState("N/A");
  const [recivedAmount, setRecivedAmount] = useState("N/A");

  const [createdAt, setCreatedAt] = useState("N/A");
  const [transactionDate, setTransactionDate] = useState("N/A");

  const [loading, setLoading] = useState(true);


  const fetchTransaction = useCallback(() => {

    axiosInterceptor({
      url: "/api/transaction/getTransactionInfo",
      method: "get",
      query: { transactionId },
    }).then(res => {

      setLoading(false)

      let transaction = res?.data?.transaction ?? {};
      setTenantName(transaction?.tenantName ?? "N/A");
      setTenantPhoneNumber(transaction?.tenantPhoneNumber ?? "N/A");
      setPropertyName(transaction?.propertyName ?? "N/A");
      setPaymentMethod(transaction?.paymentMethod ?? "N/A");
      setPaymentType(transaction?.paymentType ?? "N/A");
      setRecivedAmount(transaction?.recivedAmount ?? "N/A");
      setRemark(transaction?.remark ?? "N/A");
      setTransactionDate(formatDate(transaction?.transactionDate, 'dd-mm-yyyy'));
      setCreatedAt(formatDate(transaction?.createdAt, 'dd-mm-yyyy'))

    }).catch(err => {
      toast.error(err.message);
      navigate("/dashboard");
    })

  }, [transactionId, navigate]);

  
    useEffect(() => {
      fetchTransaction();
    }, [fetchTransaction]);
  



  return (
    <div className="min-h-screen">
      <Header active="d" />

      <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
        <h1 className="rentCoFont mainFont text-4xl ps-2">
          <span className="outlined-text-thin text-white">Transaction Details</span>
        </h1>
      </div>

      <div className="col-md-10 offset-md-1 bg-white p-2">

        {loading ? (
          <div>
            <Skeleton count={6} height={60} className="mb-3" />
          </div>
        ) : (
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
              <span className="font-bold text-2xl">Payemt Method</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{paymentMethod}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Payemt Type</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{paymentType}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Recived Amount</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{recivedAmount}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Remarks</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{remark}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Transaction Date</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{transactionDate}</span>
            </div>

            <div className="mb-3">
              <span className="font-bold text-2xl">Transaction Creation Date</span>
              <br />
              <span className="font-medium text-xl text-slate-500 ps-1">{createdAt}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
