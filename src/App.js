import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "./App.css";
import IndexPage from "./modules/auth/indexPage.jsx";
import SignIn from "./modules/auth/signIn.jsx";
import SignUp from "./modules/auth/signUp.jsx";

import Dashboard from "./modules/dashboard/dashboard.jsx";

import GroupsIndex from "./modules/groups/groupsIndex.jsx";
import CreateGroup from "./modules/groups/createGroup.jsx";
import GroupInfo from "./modules/groups/groupInfo.jsx";
import AddTenant from "./modules/groups/addTenant.jsx";

import AnalyticsIndex from "./modules/analytics/analyticsIndex.jsx";

function App() {
  return (
    <div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        draggablePercent={20}
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/groupIndex" element={<GroupsIndex />} />
          <Route path="/createGroup" element={<CreateGroup />} />
          <Route path="/groupInfo/:groupId" element={<GroupInfo />} />
          <Route path="/addTenant/:groupId" element={<AddTenant />} />

          <Route path="/analyticsIndex" element={<AnalyticsIndex />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
