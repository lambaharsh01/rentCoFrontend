import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { tenantSchema } from "../../utils/authSchemas";

import ImageCropper from "../../components/imageCropper";

export default function AddTenant() {
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
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarPictureFront, setAadhaarPictureFront] =
    useState("/plainBg.jpeg");
  const [aadhaarPictureBack, setAadhaarPictureBack] = useState("/plainBg.jpeg");
  const [tenantPicture, setTenantPicture] = useState("/plainBg.jpeg");

  const [dissabled, setDissabled] = useState(false);

  const validateGroup = () => {
    setDissabled(true);

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
    };

    tenantSchema
      .validate(tenentInfo, { abortEarly: false }) // abortEarly: false ensures all validation errors are returned
      .then((validTenant) => {
        if (tenantPhoneNumber == tenantBackupPhoneNumber)
          return toast.error(
            "Phone number and backup phone number can not be the same"
          );

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

        axiosInterceptor({
          url: "/api/tenant/validTenant",
          method: "post",
          data: validTenant,
        })
          .then((res) => {
            toast.success("Tenant creted successfully.");
            navigate(`/groupInfo/${groupId}`);
          })
          .catch((error) => {
            setDissabled(false);
            console.log(error);
            // toast.error("Images exceed the combined threshold of 5mbs");
            // toast.error("Try again later or try with compressed pictures");
          });
      })
      .catch((err) => {
        setDissabled(false);
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
          onChange={(e) => setTenantBackupPhoneNumber(e.currentTarget.value)}
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
              onCropComplete={(base64Uri) => setAadhaarPictureFront(base64Uri)}
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
              onCropComplete={(base64Uri) => setAadhaarPictureBack(base64Uri)}
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
    </div>
  );
}