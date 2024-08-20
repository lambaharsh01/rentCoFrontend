import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { tenantSchema } from "../../utils/authSchemas";

import Switch from "../../components/switch";

import ImageCropper from "../../components/imageCropper";
import { getTenantDetails } from "../../utils/redux/reduxInterceptors";

import Skeleton from "react-loading-skeleton";

export default function ViewTenant() {
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  const { tenantId } = params;

  const [groupId, setGroupId] = useState("");

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

  const [aadharPictureFrontChanged, setAadharPictureFrontChanged] =
    useState(false);
  const [aadhaarPictureBackChanged, setAadhaarPictureBackChanged] =
    useState(false);
  const [tenantPictureChanged, settenantPictureChanged] = useState(false);

  
  const [electricityBillApplicable, setElectricityBillApplicable] = useState(false);
  let [electricityAmount, setElectricityAmount] = useState("");

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
        setGroupId(tenantInfo.groupId);

        setElectricityBillApplicable(tenantInfo.electricityBillApplicable ?? false);
        setElectricityAmount(tenantInfo.electricityAmount ?? "")

        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  }, [tenantId]);

  useEffect(() => {
    tenantInfoInitialise();
  }, [tenantInfoInitialise]);

  const validateTenant = () => {
    const tenentInfo = {
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
      .validate(tenentInfo, { abortEarly: false }) // abortEarly: false ensures all validation errors are returned
      .then((validTenant) => {
        if (tenantPhoneNumber === tenantBackupPhoneNumber)
          return toast.error(
            "Phone number and backup phone number can not be the same"
          );
        
        if (electricityBillApplicable && !electricityAmount) return toast.error("Please enter electricity amount per unit");

        if (electricityBillApplicable && Number(electricityAmount) < 0) return toast.error("Electricity amount per unit can not be 0.");

        if (!electricityBillApplicable) electricityAmount = 0; // if not applocable it goes 0

        electricityAmount = Number(electricityAmount); // explisit number conversion
        
        validTenant.electricityBillApplicable = electricityBillApplicable;
        validTenant.electricityAmount = electricityAmount;

        let aadharPictures = 0;
        if (aadhaarPictureFront.length > 100) aadharPictures += 1;
        if (aadhaarPictureBack.length > 100) aadharPictures += 1;
        if (aadharPictures === 1)
          return toast.error(
            "You've only added one side of aadhaar card's photo make sure you upload both"
          );

        if (aadharPictureFrontChanged)
          validTenant.aadhaarPictureFront = aadhaarPictureFront;
        if (aadhaarPictureBackChanged)
          validTenant.aadhaarPictureBack = aadhaarPictureBack;
        if (tenantPictureChanged) validTenant.tenantPicture = tenantPicture;

        const editConfirmation = window.confirm(
          "Confim infomation edit for " + tenantName
        );

        if (!editConfirmation) return;

        setDissabled(true);
        setIsLoading(true);

        axiosInterceptor({
          url: "/api/tenant/editTenant",
          method: "put",
          data: validTenant,
          query: { tenantId },
        })
          .then((res) => {
            toast.success(res.message);
            getTenantDetails(true);
            navigate(`/groupInfo/${groupId}`, { replace: true });
            setIsLoading(false);
          })
          .catch((error) => {
            setDissabled(false);
            toast.error(error.message);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log(err)
        if (err.errors?.[0] ?? null) {
          toast.error(err.errors?.[0]);
        } else {
          toast.error("Validation failed some unknown error");
          console.log("Validation errors:", err.errors);
        }
      });
  };

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
          <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
            <h1 className="rentCoFont mainFont text-4xl ps-2">
              <span className="outlined-text-thin text-white">Edit Tenant</span>
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
                  checked={gender === "Male"}
                  onClick={() => setGender("Male")}
                />
                &nbsp; Male
              </span>
              <span>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Female"}
                  onClick={() => setGender("Female")}
                />
                &nbsp; Female
              </span>
              <span>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "Other"}
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
                  onCropComplete={(base64Uri) => {
                    setAadhaarPictureFront(base64Uri);
                    setAadharPictureFrontChanged(true);
                  }}
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
                  onCropComplete={(base64Uri) => {
                    setAadhaarPictureBack(base64Uri);
                    setAadhaarPictureBackChanged(true);
                  }}
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
                  onCropComplete={(base64Uri) => {
                    setTenantPicture(base64Uri);
                    settenantPictureChanged(true);
                  }}
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
              onClick={validateTenant}
            >
              Edit Tenant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
