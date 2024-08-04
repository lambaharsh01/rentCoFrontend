import Header from "../../components/header";
import { MdGroupAdd } from "react-icons/md";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";

import isSmallScreen from "../../utils/isSmallScreen";

export default function GroupsIndex() {
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

  const navigate = useNavigate();
  return (
    <div>
      <Header active="g" />

      <div className="container-fluid">
        <div className="row px-4 pt-4">
          <div className="col-12 flex justify-between mb-3 items-center">
            <h1 className="rentCoFont mainFont text-4xl ps-2">
              <span className="outlined-text-thin text-white">Groups</span>
            </h1>
            <MdGroupAdd
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
              {groups.map((element, index) => (
                <div
                  style={{ height: 70 }}
                  className={`mb-3 flex justify-around items-center bg-slate-100 ${
                    isSmallScreen() ? "text-sm" : "text-lg"
                  }`}
                  onClick={() => {}}
                >
                  <span className="text-center">
                    <span className="rentCoRedFont font-medium">
                      Group Name
                    </span>
                    <br />
                    <span className="font-medium">{element.groupName}</span>
                  </span>

                  <span className="text-center">
                    <span className="rentCoRedFont font-medium">Members</span>
                    <br />
                    <span className="font-medium">{element.memberCount}</span>
                  </span>

                  <span className="text-center">
                    <span className="rentCoRedFont font-medium">
                      Created At
                    </span>
                    <br />
                    <span className="font-medium">{element.createdAt}</span>
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
