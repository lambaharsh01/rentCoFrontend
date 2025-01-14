//react
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//components
import Header from "../../components/header";
import Footer from "../../components/footer";

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
    <div className="min-h-screen flex flex-col">
      <Header active="d" />

      <div className="flex-grow">
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
                      <td className="w-2/5 py-2">Paymet Method</td>
                      <td className="w-3/5 border-b-2 py-2">{paymentMethod}</td>
                  </tr>
                  <tr>
                      <td className="w-2/5 py-2">Paymet Type</td>
                      <td className="w-3/5 border-b-2 py-2">{paymentType}</td>
                  </tr>
                  <tr>
                      <td className="w-2/5 py-2">Recived Amount</td>
                      <td className="w-3/5 border-b-2 py-2">{recivedAmount}</td>
                  </tr>
                  <tr>
                      <td className="w-2/5 py-2">Remarks</td>
                      <td className="w-3/5 border-b-2 py-2">{remark}</td>
                  </tr>
                  <tr>
                      <td className="w-2/5 py-2">Transaction Date</td>
                      <td className="w-3/5 border-b-2 py-2">{transactionDate}</td>
                  </tr>
                  <tr>
                      <td className="w-2/5 py-2">Transaction Creation Date</td>
                      <td className="w-3/5 border-b-2 py-2">{createdAt}</td>
                  </tr>
                  </table>



            </div>
          )}

        </div>
      </div>

      <Footer active="d" />

    </div>
  );
}
