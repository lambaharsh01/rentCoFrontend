// react
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//UI
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";

//icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

//functions
import axiosInterceptor from "../../utils/axiosInterceptor";
import isSmallScreen from "../../utils/isSmallScreen";

//components
import Header from "../../components/header";
import Skeleton from "react-loading-skeleton";

export default function GroupsIndex() {
  const navigate = useNavigate();

  const [updationCount, setUpdationCount] = useState(1);

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInterceptor({
      url: "/api/group/getAllGroups",
      method: "get",
    })
      .then((res) => {
        setGroups(res?.data?.groups ?? []);
        setIsLoading(false);
      })
      .catch((error) => toast.error(error.message));
  }, [updationCount]);

  const deleteGroup = (groupId, groupName) => {
    var confimDeleteGroup = window.confirm(
      `Are you sure you want to delete Group(${groupName})`
    );

    if (!confimDeleteGroup) return;

    axiosInterceptor({
      url: `/api/group/deleteGroup/${groupId}`,
      method: "delete",
    })
      .then((res) => {
        toast.success(`Group ${groupName} no longer exists`);
        setUpdationCount((prevCount) => prevCount + 1);
      })
      .catch((error) => {
        toast.error(error.message);
        navigate("/groupIndex");
      });
  };

  return (
    <div>
      <Header active="g" />

      <div className="container-fluid">
        <div className="row px-4 pt-4">
          <div className="col-12 flex justify-between mb-3 items-center">
            <h1 className="rentCoFont mainFont text-4xl ps-2">
              <span className="outlined-text-thin text-white">Groups</span>
            </h1>
            <FaCirclePlus
              className="text-3xl me-2"
              onClick={() => navigate("/createGroup")}
            />
          </div>

          {isLoading ? (
            <div>
              <h1>
                <Skeleton count={5} height={70} className="mb-3" />
              </h1>
            </div>
          ) : (
            <div>
              {groups.length ? (
                groups.map((element, index) => (
                  <div
                    key={`Group${index}`}
                    style={{ height: 70 }}
                    className={`mb-3 flex justify-around items-center bg-slate-100 ${
                      isSmallScreen() ? "text-xs" : "text-lg"
                    }`}
                  >
                    <span
                      className="text-center"
                      onClick={() => navigate(`/groupInfo/${element._id}`)}
                    >
                      <span className="rentCoRedFont font-medium">
                        Group Name
                      </span>
                      <br />
                      <span className="font-medium">{element.groupName}</span>
                    </span>

                    <span
                      className="text-center"
                      onClick={() => navigate(`/groupInfo/${element._id}`)}
                    >
                      <span className="rentCoRedFont font-medium">Tenants</span>
                      <br />
                      <span className="font-medium">{element.tenantCount}</span>
                    </span>

                    <span
                      className="text-center"
                      onClick={() => navigate(`/groupInfo/${element._id}`)}
                    >
                      <span className="rentCoRedFont font-medium">
                        Created At
                      </span>
                      <br />
                      <span className="font-medium">{element.createdAt}</span>
                    </span>

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
                                  deleteGroup(element._id, element.groupName)
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
                                  navigate(`/editGroup/${element._id}`)
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
                ))
              ) : (
                <div>No Groups Found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
