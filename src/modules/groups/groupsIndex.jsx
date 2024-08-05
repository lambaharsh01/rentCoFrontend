import Header from "../../components/header";
import { FaCirclePlus } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";

import isSmallScreen from "../../utils/isSmallScreen";

export default function GroupsIndex() {
  const navigate = useNavigate();

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
  }, []);

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
                    onClick={() => navigate(`/groupInfo/${element._id}`)}
                    style={{ height: 70 }}
                    className={`mb-3 flex justify-around items-center bg-slate-100 ${
                      isSmallScreen() ? "text-sm" : "text-lg"
                    }`}
                  >
                    <span className="text-center">
                      <span className="rentCoRedFont font-medium">
                        Group Name
                      </span>
                      <br />
                      <span className="font-medium">{element.groupName}</span>
                    </span>

                    <span className="text-center">
                      <span className="rentCoRedFont font-medium">Tenants</span>
                      <br />
                      <span className="font-medium">{element.tenantCount}</span>
                    </span>

                    <span className="text-center">
                      <span className="rentCoRedFont font-medium">
                        Created At
                      </span>
                      <br />
                      <span className="font-medium">{element.createdAt}</span>
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
