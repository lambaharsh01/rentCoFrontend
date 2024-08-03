import { useState } from "react";
import Header from "../../components/header";
import { toast, ToastContainer } from "react-toastify";
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDiscription, setGroupDiscription] = useState("");

  const validateGroup = () => {
    if (groupName.length < 4)
      toast.error("Enter at least 4 characters in the group name.");

    axiosInterceptor({
      url: "",
      method: "post",
      data: {},
    })
      .then((res) => {})
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="min-h-screen p-2">
      <Header active="g" />

      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
      />

      <div className="col-md-10 offset-md-1 text-center ps-3 mt-4 mb-4">
        <h1 className="rentCoFont mainFont text-4xl ps-2">
          <span className="outlined-text-thin text-white">Create Group</span>
        </h1>
      </div>

      <div className="col-md-10 offset-md-1 bg-white ">
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
          Create Group
        </button>
      </div>
    </div>
  );
}
