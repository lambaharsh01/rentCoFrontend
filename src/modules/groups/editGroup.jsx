//react
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//components
import Header from "../../components/header";
import Footer from "../../components/footer";
import Skeleton from "react-loading-skeleton";

//ui
import { toast } from "react-toastify";

//functions
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function EditGroup() {
  const navigate = useNavigate();
  const params = useParams();

  const { groupId } = params;

  const [loading, setIsLoading] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [groupDiscription, setGroupDiscription] = useState("");

  const initialData = useCallback(() => {
    axiosInterceptor({
      url: "/api/group/getGroupInfo",
      method: "get",
      query: { groupId },
    })
      .then((res) => {
        setIsLoading(false);
        setGroupName(res?.data?.groupInfo?.groupName ?? "");
        setGroupDiscription(res?.data?.groupInfo?.groupDiscription ?? "");
      })
      .catch((error) => toast.error(error.message));
  }, [groupId]);

  useEffect(() => {
    initialData();
  }, [initialData]);

  const validateGroup = () => {
    if (groupName.length < 4)
      return toast.error("Enter at least 4 characters in the group name.");
    if (groupDiscription.length < 6)
      return toast.error(
        "Enter a small discription of the group (i.e. what it is for)"
      );

    let confirmChange = window.confirm(
      "Please confim the changes to the group information."
    );

    if (!confirmChange) return;

    axiosInterceptor({
      url: "/api/group/updateGroup",
      method: "put",
      data: { groupName, groupDiscription, groupId },
    })
      .then((res) => {
        toast.success(res.message);
        return navigate("/groupIndex", { replace: true });
      })
      .catch((error) => {
        toast.error(error.message);
        return navigate("/groupIndex", { replace: true });
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header active="g" />

      <div className="flex-grow">
        {loading ? (
          <div className="pt-5 col-md-10 offset-md-1 ">
            <Skeleton height={50} className="mb-2" />
            <Skeleton height={60} className="mb-2" />
            <Skeleton height={50} className="mb-2" />
          </div>
        ) : (
          <>
            <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
              <h1 className="rentCoFont mainFont text-4xl ps-2">
                <span className="outlined-text-thin text-white">Edit Group</span>
              </h1>
            </div>

            <div className="col-md-10 offset-md-1 bg-white p-2">
              <input
                type="text"
                className="px-3 py-2 mb-3  rounded-full w-100 bg-slate-100"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.currentTarget.value)}
              />
              <textarea
                type="email"
                className="px-3 py-2 mb-3  rounded-full w-100 bg-slate-100"
                placeholder="Enter Group Discription (Optional)"
                value={groupDiscription}
                onChange={(e) => setGroupDiscription(e.currentTarget.value)}
                rows={2}
              ></textarea>

              <button
                className="bg-slate-950 rounded-full text-white text-lg px-md-12 py-2 w-100"
                onClick={validateGroup}
              >
                Edit Group
              </button>
            </div>
          </>
        )}
      </div>
      <Footer active="g" />
    </div>
  );
}
