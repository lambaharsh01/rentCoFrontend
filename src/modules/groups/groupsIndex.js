import Header from "../../components/header";
import { MdGroupAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { useEffect, useState } from "react";
// getAllGroups
export default function GroupsIndex() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axiosInterceptor({
      url: "/api/group/getAllGroups",
      method: "get",
    })
      .then((res) => {
        setGroups(res?.data?.groups ?? []);
        toast.success(res.message);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      <Header active="g" />

      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 flex justify-end pt-2 pe-4">
            <MdGroupAdd
              className="text-3xl"
              onClick={() => navigate("/createGroup")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
