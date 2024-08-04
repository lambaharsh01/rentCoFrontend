import Header from "../../components/header";
import { MdGroupAdd } from "react-icons/md";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { useCallback, useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";

// import isSmallScreen from "../../utils/isSmallScreen";

export default function GroupsIndex() {
  const params = useParams();
  const navigate = useNavigate();

  const { groupId } = params;

  const [isLoading, setIsLoading] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [groupDiscription, setGroupDiscription] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);
  const [memberList, setMemberList] = useState([]);

  const getBaseGroupInfo = useCallback(() => {
    axiosInterceptor({
      url: "/api/group/getGroupInfo",
      method: "get",
      query:{groupId}
    })
      .then((res) => {
        setIsLoading(false);
        setGroupName('Dukan')
        setGroupDiscription('setGroupDiscription setGroupDiscription setGroupDiscription setGroupDiscription setGroupDiscription setGroupDiscription setGroupDiscription setGroupDiscription');
        setTotalMembers(5)

        // setMemberList
      })
      .catch((error) => {
        toast.error(error.message) 
        navigate('/groupIndex');
      });
  },[groupId, navigate])

  useEffect(() => {
    getBaseGroupInfo()
  }, [getBaseGroupInfo]);

  return (
    <div>
      <Header active="g" />

      <div className="container-fluid">
        <div className="row px-4 pt-4">
          <div className="col-12 flex justify-between mb-3 items-center">
            <h1 className="rentCoFont text-3xl ps-2"> 
              { isLoading ? (
                <span><Skeleton width={70}/></span>
              ) : groupName}
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
              <div className="w-100">
                  <details>
                  <summary className="font-medium list-none">Click for Group Details</summary>
                  <p className="text-sm ps-4">
                    <span className="font-medium">Discription</span>: <span className="font-light text-xs">{groupDiscription}</span>
                  </p>
                  </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
