//react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import Header from "../../components/header";
import Footer from "../../components/footer";

//ui
import { toast } from "react-toastify";

//function
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupDiscription, setGroupDiscription] = useState("");

  const validateGroup = () => {
    if (groupName.length < 4)
      return toast.error("Enter at least 4 characters in the group name.");
    if (groupDiscription.length < 6)
      return toast.error(
        "Enter a small discription of the group (i.e. what it is for)"
      );

    axiosInterceptor({
      url: "/api/group/createGroup",
      method: "post",
      data: { groupName, groupDiscription },
    })
      .then((res) => {
        toast.success(res.message);
        return navigate("/groupIndex", { replace: true });
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header active="g" />
      <div className="flex-grow">
      <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
        <h1 className="rentCoFont mainFont text-4xl ps-2">
          <span className="outlined-text-thin text-white">Create Group</span>
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
          Create Group
        </button>
      </div>
      </div>
      <Footer active="g" />
    </div>
  );
}
