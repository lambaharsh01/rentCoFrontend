import { useState } from "react"
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

import { MdCall, MdOutlineWhatsapp } from "react-icons/md";
import { FiChevronsDown } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import isSmallScreen from "../utils/isSmallScreen";
import Skeleton from "react-loading-skeleton";

export default function AllTenantsComponent() {

    const navigate = useNavigate();
    const smallScreen = isSmallScreen();

    const [tenants, setTenants] = useState([]);

    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTenantList = () => { 
        setLoading(true);
        setSearched(true)
        axiosInterceptor({
            url: "/api/tenant/getAllTenantsWithImage",
            method: "get"
        }).then(res => {
            setTenants(res?.data?.tenantDetails ?? []);
            setLoading(false);
        }).catch(err => {
            toast.error("Could not fetch tenants");
            setLoading(false);
        });
    };
    
    const navigateTenant = (tenantId) => {
        navigate("/viewTenant/" + tenantId)
    }


    return <div className="w-100 p-2">

        <div className="w-100 border-1 rounded-md">

            <div className="rentCoRed rounded-t-md text-center py-1 font-bold">Tenants</div>

            {!searched ? (    

                <div className="px-2">
                   <div 
                   className="border-y-2 mt-2 text-center flex justify-center py-1 mb-3 bg-slate-200"
                    onClick={fetchTenantList}>
                    <span className="me-2 font-semibold text-sm">Click Here To Fetch Tenant List</span>
                    <FiChevronsDown className="text-xl" />
                    </div>
                </div>

            ) : (
                <div className="w-100 p-2 mt-1 scrolMaxHeight300">
                        
                { !loading && !tenants.length && (
                    <div className="w-100 text-center">
                        <span className="text-sm font-light text-center">No Tenants Found</span>
                    </div>
                )}
                
            {loading ? (
            <span>
                <Skeleton count={3} height={60} className="mb-3" />
            </span>         
            ) : tenants.map((element, index) => (
                    <div
                        key={`Tenant${index}`}
                        className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${smallScreen ? "h-16 text-xs" : "h-20"
                        }`}
                    >
                        <span style={{width:"24%"}} onClick={()=>navigateTenant(element.tenantId)}>
                        <img
                            src={element.tenantPicture}
                            alt="tenantImages"
                            className="rounded-full ms-1 w-14"
                            loading="lazy"
                        />
                        </span>
                        <span onClick={()=>navigateTenant(element.tenantId)} style={{width:"24%"}}>{element.tenantName}</span>
                        <span onClick={()=>navigateTenant(element.tenantId)} style={{width:"24%"}}>{element.propertyName}</span>
                        <a style={{width:"14%"}} href={`https://wa.me/${element.tenantPhoneNumber}?text=Hi`}>
                            <MdOutlineWhatsapp className="text-2xl text-green-500"/>
                        </a>
                        <a style={{width:"14%"}} href={`tel:${element.tenantPhoneNumber}`}>
                            <MdCall className="text-2xl"/>
                        </a>
                        
                    </div>
            ))}

            </div>
            )}

        </div>
    </div>
}