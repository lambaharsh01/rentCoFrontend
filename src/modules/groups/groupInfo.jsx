import Header from "../../components/header";
import { MdGroupAdd } from "react-icons/md";
import { IoInformationCircleSharp } from "react-icons/io5";
import { MdDelete,MdEdit } from "react-icons/md";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { useCallback, useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";

import isSmallScreen from "../../utils/isSmallScreen";

export default function GroupsIndex() {
  const smallScreen = isSmallScreen();
  const params = useParams();
  const navigate = useNavigate();

  const { groupId } = params;

  const [isLoading, setIsLoading] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [groupCreatedAt, setGroupCreatedAt] = useState("");
  const [groupDiscription, setGroupDiscription] = useState("");
  const [totalTenants, setTotalTenants] = useState(0);
  const [tenantList, setTenantList] = useState([]);

  const getBaseGroupInfo = useCallback(() => {
    axiosInterceptor({
      url: "/api/group/getGroupInfo",
      method: "get",
      query: { groupId },
    })
      .then((res) => {
        setIsLoading(false);
        setGroupName(res?.data?.groupInfo?.groupName ?? "");

        setGroupDiscription(res?.data?.groupInfo?.groupDiscription ?? "");
        setTotalTenants(res?.data?.groupInfo?.tenantCount ?? "");
        setGroupCreatedAt(res?.data?.groupInfo?.createdAt ?? "");

        setTenantList(res?.data?.groupInfo?.tenants ?? []);
      })
      .catch((error) => {
        toast.error(error.message);
        navigate("/groupIndex");
      });
  }, [groupId, navigate]);

  useEffect(() => {
    getBaseGroupInfo();
  }, [getBaseGroupInfo]);

  const deleteGroup = () => {
    var confimDeleteGroup = window.confirm(`Are you sure you want to delete Group(${groupName})`);

    if (!confimDeleteGroup) return;
    
    axiosInterceptor({
      url: `/api/group/deleteGroup/${groupId}`,
      method: "delete",
    })
      .then((res) => {
         toast.success(`Group ${groupName} no longer exists`);
        navigate("/groupIndex");
      })
      .catch((error) => {
        toast.error(error.message);
        navigate("/groupIndex");
      });
    
  }

  return (
    <div>
      <Header active="g" />

      <div className="container-fluid">
        <div className="row px-2 pt-4">
          <div className="col-12 flex justify-between mb-3 items-center">
            <h1 className="rentCoFont text-3xl ps-2">
              {isLoading ? (
                <span>
                  <Skeleton width={70} />
                </span>
              ) : (
                groupName
              )}
            </h1>
            <MdGroupAdd
              className="text-3xl me-2"
              onClick={() => navigate(`/addTenant/${groupId}`)}
            />
          </div>

          {isLoading ? (
            <div>
              <h1>
                <Skeleton count={5} height={70} className="mb-3" />
              </h1>
            </div>
          ) : (
            <div className="w-100">
              <details className="border-2 rounded-md py-1 mb-4 relative">
                <summary className="list-none ps-2">
                  <IoInformationCircleSharp className="text-lg" />
                  </summary>
                  
                  <div className="absolute right-0 bottom-0 text-2xl pe-2 pb-2">
                    <MdDelete className="mb-2 text-red-600" onClick={deleteGroup}/>
                    <MdEdit className="text-blue-950"/>
                  </div>
                <span className="text-sm ps-4">
                  <span className="font-medium">Created At</span>:{" "}
                  <span className="font-light text-xs">{groupCreatedAt}</span>
                </span>
                <br />
                <span className="text-sm ps-4">
                  <span className="font-medium">Total Tenants</span>:{" "}
                  <span className="font-light text-xs">{totalTenants}</span>
                </span>
                <br />
                <span className="text-sm ps-4">
                  <span className="font-medium">Discription</span>:{" "}
                  <span className="font-light text-xs">{groupDiscription}</span>
                </span>
              </details>
              {tenantList.map((element, index) => (
                <div
                  className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${
                    smallScreen ? "h-16" : "h-20"
                  }`}
                >
                  <img
                    src={element.tenantPicture}
                    alt="tenantImages"
                    className="rounded-full h-100 ms-1"
                    loading="lazy"
                  />
                  <span>{element.tenantName}</span>
                  <span>{element.tenantPhoneNumber}</span>
                  <span>{element.rentAmount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
