import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { tenantSchema } from "../../utils/authSchemas";

import { getTenantDetails } from "../../utils/redux/reduxInterceptors";


import ImageCropper from "../../components/imageCropper";

import Switch from "../../components/switch";

import Skeleton from "react-loading-skeleton";

export default function AddTenant() {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const { groupId } = params;

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

  const [dissabled, setDissabled] = useState(false);

  const [electricityBillApplicable, setElectricityBillApplicable] = useState(true);
  const [electricityAmount, setElectricityAmount] = useState("");

  const validateGroup = () => {
    const tenentInfo = {
      groupId,
      tenantName,
      tenantEmail,
      tenantPhoneNumber,
      tenantBackupPhoneNumber,
      gender,
      tenancyType,
      rentAmount,
      aadhaarNumber,
      propertyName,
      propertyAddress,
    };

    tenantSchema
      .validate(tenentInfo, { abortEarly: false })
      .then((validTenant) => {
        if (tenantPhoneNumber === tenantBackupPhoneNumber)
          return toast.error(
            "Phone number and backup phone number can not be the same"
          );
        
        if (electricityBillApplicable && !electricityAmount) return toast.error("Please enter electricity amount per unit");

        if (electricityBillApplicable && Number(electricityAmount) <= 0) return toast.error("Electricity amount per unit shuld be more than 0.");

        if (!electricityBillApplicable) setElectricityAmount(0); // if not applicable it goes 0

        setElectricityAmount(prevAmount=>Number(prevAmount)); // explisit number conversion
        
        validTenant.electricityBillApplicable = electricityBillApplicable;
        validTenant.electricityAmount = electricityAmount;

        let aadharPictures = 0;
        if (aadhaarPictureFront.length > 100) aadharPictures += 1;
        if (aadhaarPictureBack.length > 100) aadharPictures += 1;
        if (aadharPictures === 1)
          return toast.error(
            "You've only added one side of aadhaar card's photo make sure you upload both"
          );

        if (aadhaarPictureFront.length > 100)
          validTenant.aadhaarPictureFront = aadhaarPictureFront;
        if (aadhaarPictureBack.length > 100)
          validTenant.aadhaarPictureBack = aadhaarPictureBack;
        if (tenantPicture.length > 100)
          validTenant.tenantPicture = tenantPicture;

        setIsLoading(true);
        setDissabled(true);

        axiosInterceptor({
          url: "/api/tenant/addTenant",
          method: "post",
          data: validTenant,
        })
          .then((res) => {
            toast.success("Tenant creted successfully.");
            getTenantDetails(true);
            navigate(`/groupInfo/${groupId}`, { replace: true });
          })
          .catch((error) => {
            setDissabled(false);
            toast.error(error.message);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        if (err.errors?.[0] ?? null) {
          toast.error(err.errors?.[0]);
        } else {
          toast.error("Validation failed some unknown error");
          console.log("Validation errors:", err.errors);
        }
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header active="g" />

      <div className="flex-grow">
        {isLoading ? (
          <div className="p-3">
            <h1 className="mt-3">
              <Skeleton count={2} height={70} className="mb-3" />
            </h1>
          </div>
        ) : (
          <>
            <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
              <h1 className="rentCoFont mainFont text-4xl ps-2">
                <span className="outlined-text-thin text-white">Add Tenant</span>
              </h1>
            </div>

            <div className="col-md-10 offset-md-1 bg-white p-2">
              <input
                type="text"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Tenant's Name"
                value={tenantName}
                onChange={(e) => setTenantName(e.currentTarget.value)}
              />

              <input
                type="email"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Tenant's Email (optional)"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.currentTarget.value)}
              />

              <input
                type="number"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Tenant's Phone Number"
                value={tenantPhoneNumber}
                onChange={(e) => setTenantPhoneNumber(e.currentTarget.value)}
              />

              <input
                type="number"
                className="px-3 py-2 mb-4 rounded-full w-100 bg-slate-100"
                placeholder="Enter Tenant's BackUp Phone Number(optional)"
                value={tenantBackupPhoneNumber}
                onChange={(e) =>
                  setTenantBackupPhoneNumber(e.currentTarget.value)
                }
              />

              <div
                className="w-100 flex justify-between mb-4 text-slate-500 px-2"
                style={{ fontSize: 15 }}
              >
                <span>Tenant's Gender</span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Male")}
                  />
                  &nbsp; Male
                </span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Female")}
                  />
                  &nbsp; Female
                </span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Other")}
                  />
                  &nbsp; Other
                </span>
              </div>

              <select
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                value={tenancyType}
                onChange={(e) => setTenancyType(e.target.value)}
              >
                <option value="">Select Tenancy Type</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="industrial">Industrial</option>
                <option value="retail">Retail</option>
                <option value="mixed-use">Mixed-use</option>
                <option value="vacation-rental">Vacation Rental</option>
              </select>

              <input
                type="number"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Rent(Per Month)"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.currentTarget.value)}
                />
                
                <div className="mb-4 flex justify-between w-100 text-slate-500 px-2"
                  style={{ fontSize: 15 }}>
                  
                  <span>Electricity Bill Applicable</span>   
                  <Switch checked={electricityBillApplicable} onChange={(e)=>setElectricityBillApplicable(e)}/>
                
                </div>

                {electricityBillApplicable && (
                <input
                type="number"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Electricity Amount(Per Unit)"
                value={electricityAmount}
                onChange={(e) => setElectricityAmount(e.currentTarget.value)}
                />
                )}



              <input
                type="text"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Property Name"
                value={propertyName}
                onChange={(e) => setPropertyName(e.currentTarget.value)}
              />

              <input
                type="text"
                className="px-3 py-2 mb-4  rounded-full w-100 bg-slate-100"
                placeholder="Enter Property Address(optional)"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.currentTarget.value)}
              />

              <input
                type="number"
                className="px-3 py-2 mb-4 rounded-full w-100 bg-slate-100"
                placeholder="Enter Tenant's Aadhaar No.(optional)"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.currentTarget.value)}
              />

              <div
                className="text-center text-sm-start mb-4 text-slate-500 px-2"
                style={{ fontSize: 15 }}
              >
                <div>
                  <span>Upload aadhaar card's front side(optional)</span>
                  <br />
                  <ImageCropper
                    ratio={3 / 2}
                    onCropComplete={(base64Uri) =>
                      setAadhaarPictureFront(base64Uri)
                    }
                    height={100}
                    width={150}
                    value={aadhaarPictureFront}
                    iconSize="text-3xl"
                  />
                </div>
              </div>

              <div
                className="text-center text-sm-start mb-4 text-slate-500 px-2"
                style={{ fontSize: 15 }}
              >
                <div>
                  <span>Upload aadhaar card's back side(optional)</span>
                  <br />
                  <ImageCropper
                    ratio={3 / 2}
                    onCropComplete={(base64Uri) =>
                      setAadhaarPictureBack(base64Uri)
                    }
                    height={100}
                    width={150}
                    value={aadhaarPictureBack}
                    iconSize="text-3xl"
                  />
                </div>
              </div>

              <div
                className="text-center text-sm-start mb-4 text-slate-500 px-2"
                style={{ fontSize: 15 }}
              >
                <div>
                  <span>Upload Tenant's Picture(optional)</span>
                  <br />
                  <ImageCropper
                    ratio={1 / 1}
                    onCropComplete={(base64Uri) => setTenantPicture(base64Uri)}
                    height={150}
                    width={150}
                    value={tenantPicture}
                    iconSize="text-3xl"
                  />
                </div>
              </div>

              <button
                className="bg-slate-950 rounded-full text-white text-lg px-md-12 py-2 w-100"
                disabled={dissabled}
                onClick={validateGroup}
              >
                Add Tenant
              </button>
            </div>
          </>
        )}
      </div>
      <Footer active="g" />
    </div>
  );
}
