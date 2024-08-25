import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";

import { MdCall, MdOutlineWhatsapp } from "react-icons/md";

import Skeleton from "react-loading-skeleton";

export default function ViewTenant() {
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  const { tenantId } = params;

  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState("");
  const [tenantBackupPhoneNumber, setTenantBackupPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [tenancyType, setTenancyType] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarPictureFront, setAadhaarPictureFront] =
    useState("/plainBg.jpeg");
  const [aadhaarPictureBack, setAadhaarPictureBack] = useState("/plainBg.jpeg");
  const [tenantPicture, setTenantPicture] = useState("/dummyUserImage.png");

  
  const [electricityBillApplicable, setElectricityBillApplicable] = useState(false);
  const [electricityAmount, setElectricityAmount] = useState("");

  const tenantInfoInitialise = useCallback(() => {
    axiosInterceptor({
      url: "/api/tenant/getTenantInfo",
      method: "get",
      query: { tenantId },
    })
      .then((res) => {
        let tenantInfo = res.data.tenantInfo ?? {};
        setTenantName(tenantInfo.tenantName ?? "");
        setTenantEmail(tenantInfo.tenantEmail ?? "");
        setTenantPhoneNumber(tenantInfo.tenantPhoneNumber ?? "");
        setTenantBackupPhoneNumber(tenantInfo.tenantBackupPhoneNumber ?? "");
        setGender(tenantInfo.gender ?? "");
        setTenancyType(tenantInfo.tenancyType ?? "");
        setRentAmount(tenantInfo.rentAmount ?? "");
        setPropertyName(tenantInfo.propertyName ?? "");
        setPropertyAddress(tenantInfo.propertyAddress ?? "");
        setAadhaarNumber(tenantInfo.aadhaarNumber ?? "");
        setAadhaarPictureFront(
          tenantInfo.aadhaarPictureFront ?? "/plainBg.jpeg"
        );
        setAadhaarPictureBack(tenantInfo.aadhaarPictureBack ?? "/plainBg.jpeg");
        setTenantPicture(tenantInfo.tenantPicture ?? "/dummyUserImage.png");

        setElectricityBillApplicable(tenantInfo.electricityBillApplicable ?? false);
        setElectricityAmount(tenantInfo.electricityAmount ?? "")

        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  }, [tenantId] );

  useEffect(() => {
    tenantInfoInitialise();
  }, [tenantInfoInitialise]);



  return (
    <div className="min-h-screen">
      <Header active="g" />

      {isLoading ? (
        <div className="p-3">
          <h1 className="mt-3">
            <Skeleton count={2} height={70} className="mb-3" />
          </h1>
        </div>
      ) : (
        <>
     

          <div className="col-md-10 offset-md-1 bg-white p-2">

              <div className="flex justify-center pb-3">
                <img src={tenantPicture} alt="TenantPicture" className="h-32 w-32" />
              </div>
              <div>
                <table className="w-100 font-medium border-y-2 ">
                  <tr>
                    <td className="w-1/3 py-2">Name</td>
                    <td className="w-2/3 border-b-2 py-2">{tenantName}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Email</td>
                    <td className="w-2/3 border-b-2 py-2">{tenantEmail}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Phone No.</td>
                    <td className="w-2/3 border-b-2 py-2">
                      <div className="flex justify-between">
                      <span>{tenantPhoneNumber}</span>
                        <a href={`https://wa.me/${tenantPhoneNumber}?text=Hi`}>
                            <MdOutlineWhatsapp className="text-2xl text-green-500"/>
                        </a>
                        <a href={`tel:${tenantPhoneNumber}`}>
                            <MdCall className="text-2xl"/>
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Back Up No.</td>
                    <td className="w-2/3 border-b-2 py-2">
                      {tenantBackupPhoneNumber && (
                      <div className="flex justify-between">
                      <span>{tenantBackupPhoneNumber}</span>
                        <a href={`https://wa.me/${tenantBackupPhoneNumber}?text=Hi`}>
                            <MdOutlineWhatsapp className="text-2xl text-green-500"/>
                        </a>
                        <a href={`tel:${tenantBackupPhoneNumber}`}>
                            <MdCall className="text-2xl"/>
                        </a>
                        </div>
                      )}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Gender</td>
                    <td className="w-2/3 border-b-2 py-2">{gender}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Tenancy Type</td>
                    <td className="w-2/3 border-b-2 py-2">{tenancyType}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Rent Amount</td>
                    <td className="w-2/3 border-b-2 py-2">{rentAmount}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Electricity Bill</td>
                    <td className="w-2/3 border-b-2 py-2">{electricityBillApplicable ?electricityAmount : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Property Name</td>
                    <td className="w-2/3 border-b-2 py-2">{propertyName}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Property Add.</td>
                    <td className="w-2/3 border-b-2 py-2">{propertyAddress}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Aadhaar No.</td>
                    <td className="w-2/3 border-b-2 py-2">{aadhaarNumber}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Aadhaar Front</td>
                    <td className="w-2/3 border-b-2 py-2">
                    <img src={aadhaarPictureFront} alt="aadhaarImageFrnt" className="h-20 w-32" />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/3 py-2">Aadhaar Back</td>
                    <td className="w-2/3 border-b-2 py-2">
                    <img src={aadhaarPictureBack} alt="aadhaarImageFrnt" className="h-20 w-32" />
                    </td>
                  </tr>

                 

                </table>
              </div>

          </div>
        </>
      )}
    </div>
  );
}
