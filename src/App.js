import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";

import "./App.css";
import IndexPage from "./modules/auth/indexPage.jsx";
import SignIn from "./modules/auth/signIn.jsx";
import SignUp from "./modules/auth/signUp.jsx";

import Dashboard from "./modules/dashboard/dashboard.jsx";

import GroupsIndex from "./modules/groups/groupsIndex.js";
import CreateGroup from "./modules/groups/createGroup.js";

import AnalyticsIndex from "./modules/analytics/analyticsIndex.js";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/groupIndex" element={<GroupsIndex />} />
          <Route path="/createGroup" element={<CreateGroup />} />

          <Route path="/analyticsIndex" element={<AnalyticsIndex />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
