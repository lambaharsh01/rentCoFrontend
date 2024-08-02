import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";

import "./App.css";
import IndexPage from "./modules/auth/indexPage.jsx";
import SignIn from "./modules/auth/signIn.jsx";
import SignUp from "./modules/auth/signUp.jsx";

// axios.defaults.baseURL = "http://192.168.142.20:8080";
// axios.defaults.baseURL = "https://ticketingbackendmongodb-1.onrender.com";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
