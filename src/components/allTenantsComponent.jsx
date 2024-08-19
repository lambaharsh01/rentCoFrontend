import { useCallback, useEffect, useState } from "react"
import getCurrentMonthBoundaries from "../utils/getCurrentMonthBoundaries";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "react-toastify";

import { MdCall, MdOutlineWhatsapp } from "react-icons/md";

import { useNavigate } from "react-router-dom";

import isSmallScreen from "../utils/isSmallScreen";


export default function AllTenantsComponent() {

    
    const navigate = useNavigate();
    const smallScreen = isSmallScreen();
    const currentMonthBoundaries = getCurrentMonthBoundaries();

    const [tenants, setTenants] = useState([]);


    useEffect(() => { 

        axiosInterceptor({
            url: "/api/tenant/getAllTenantsWithImage",
            method: "get"
        }).then(res => {
            setTenants(res?.data?.tenantDetails ?? []);
        }).catch(err => {
            toast.error("Could not fetch tenants");
        });
    }, []);
    


    return <div className="w-100 p-2">

        <div className="w-100 border-1 rounded-t-md">

            <div className="rentCoRed rounded-t-md text-center py-1 font-bold">Tenants</div>
             

            <div className="w-100 p-2">

                {tenants.map((element, index) => (
                    <div
                        key={`Tenant${index}`}
                        className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${smallScreen ? "h-16 text-xs" : "h-20"
                            }`}
                    >
                        <span style={{width:"24%"}}>
                        <img
                            src={element.tenantPicture}
                            alt="tenantImages"
                            className="rounded-full ms-1 w-14"
                            loading="lazy"
                        />
                        </span>

                        <span style={{width:"24%"}}>{element.tenantName}</span>
                        <span style={{width:"24%"}}>{element.propertyName}</span>

                        <a style={{width:"14%"}} href={`tel:${element.tenantPhoneNumber}`}>
                            <MdCall className="text-2xl"/>
                        </a>

                        <a style={{width:"14%"}} href={`https://wa.me/${element.tenantPhoneNumber}?text=Hi`}>
                            <MdOutlineWhatsapp className="text-2xl text-green-500"/>
                        </a>
                        
                    </div>
                ))}

            </div>

        </div>
    </div>
}