//react
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//components
import Header from "../../components/header";
import Skeleton from "react-loading-skeleton";

//icons
import { MdGroupAdd } from "react-icons/md";
import { IoInformationCircleSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

//ui
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";

//functions
import isSmallScreen from "../../utils/isSmallScreen";
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function GroupsIndex() {
  const smallScreen = isSmallScreen();
  const params = useParams();
  const navigate = useNavigate();

  const { groupId } = params;

  const [updationCount, setUpdationCount] = useState(1);

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
        navigate("/groupIndex", { replace: true });
      });
  }, [groupId, navigate]);

  useEffect(() => {
    getBaseGroupInfo();
  }, [getBaseGroupInfo, updationCount]);

  const deleteUser = (tenantId, tenantName) => {
    var confimDeleteGroup = window.confirm(
      `Are you sure you want to remove ${tenantName} from the group.`
    );

    if (!confimDeleteGroup) return;

    axiosInterceptor({
      url: `/api/tenant/deleteTenant/${tenantId}`,
      method: "delete",
    })
      .then((res) => {
        toast.success(res.message);
        setUpdationCount((prevCount) => prevCount + 1);
      })
      .catch((error) => {
        toast.error(error.message);
        navigate("/groupIndex", { replace: true });
      });
  };

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
              <details className="border-2 rounded-md py-1 mb-4">
                <summary className="list-none ps-2">
                  <IoInformationCircleSharp className="text-lg" />
                </summary>

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
                  key={`Tenant${index}`}
                  className={`font-medium w-100 bg-slate-100 mb-3 p-1 rounded-md flex justify-around items-center ${
                    smallScreen ? "h-16 text-xs" : "h-20"
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
                  <span className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="none">
                        <BsThreeDotsVertical className="text-2xl" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ minWidth: 80 }}>
                        <div className="w-100 flex justify-center">
                          <div>
                            <div
                              className="flex justify-between"
                              onClick={() =>
                                deleteUser(element._id, element.tenantName)
                              }
                            >
                              <span className="font-light text-xs pt-1">
                                Delete
                              </span>
                              <MdDelete className="mb-1 text-red-500 text-xl" />
                            </div>

                            <div
                              className="flex justify-between"
                              onClick={() =>
                                navigate(`/editTenant/${element._id}`)
                              }
                            >
                              <span className="font-light text-xs pt-1">
                                Edit
                              </span>
                              <MdEdit className="mt-1 text-blue-500 text-xl" />
                            </div>
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
