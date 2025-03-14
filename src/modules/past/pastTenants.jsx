//react
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import Header from "../../components/header";
import Footer from "../../components/footer";
import Skeleton from "react-loading-skeleton";

//icons
import { MdCall } from "react-icons/md";
// import { IoInformationCircleSharp } from "react-icons/io5";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { MdDelete, MdEdit } from "react-icons/md";

//ui
import { toast } from "react-toastify";
// import { Dropdown } from "react-bootstrap";

//functions
import isSmallScreen from "../../utils/isSmallScreen";
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function PastTenants() {
  const smallScreen = isSmallScreen();
  const navigate = useNavigate();

//   const [updationCount, setUpdationCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [tenantList, setTenantList] = useState([]);

    const navigateDetails = (tenantId, element) => {
        navigate("/pastTenantDetails/" + tenantId, {state:element});
    }
  
    const fetchTenantList = useCallback(() => { 
        setIsLoading(true);
        axiosInterceptor({
            url: "/api/past/getAllTenants",
            method: "get"
        }).then(res => {
            setTenantList(res?.data?.tenantDetails ?? []);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            toast.error("Could not fetch past tenants");
        });
    }, []);
    
    useEffect(() => { 
        fetchTenantList()
    }, [fetchTenantList])
    

  return (
    <div className="min-h-screen flex flex-col">
      <Header active="p" />
      <div className="flex-grow">
        <div className="container-fluid">
          <div className="row pt-4">
            <div className="col-12 flex justify-between mb-3 items-center">
              <h1 className="rentCoFont text-3xl ps-2">
                  Past Tenants
              </h1>
            </div>

            {isLoading ? (
              <div>
                <h1>
                  <Skeleton count={5} height={70} className="mb-3" />
                </h1>
              </div>
            ) : (
              <div className="w-100">
                
                {tenantList.map((element, index) => (
                  <div
                    key={`Tenant${index}`}
                    className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${
                      smallScreen ? "h-16 text-xs" : "h-20"
                    }`}
                    >
                        <span className="flex justify-center">
                          <img
                              src={element.tenantPicture}
                              alt="tenantImages"
                              className="rounded-md TeST h-8 w-8 ms-1"
                              loading="lazy"
                              onClick={()=>navigateDetails(element.tenantId, element)}
                          />
                            <span
                                className="mt-1.5 ms-0.5"
                                onClick={() => navigateDetails(element.tenantId, element)}
                            >{element.tenantName}</span>
                      </span>

                    <span className="text-center">
                    {element.propertyName}
                    </span>

                    <span 
                    onClick={() => navigateDetails(element.tenantId, element)}
                    className={`${element.dueBalance > 0 ? "text-red-600" :"text-green-600"} px-2`}>
                      {element.dueBalance?.toString()?.replaceAll("-", "") || "-"}  
                    </span>

                    <a href={`tel:${element.tenantPhoneNumber}`}>
                        <MdCall className="text-2xl"/>
                    </a>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer active="p" />
    </div>
  );
}
