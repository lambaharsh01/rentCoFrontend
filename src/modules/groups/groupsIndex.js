import Header from "../../components/header";
import { MdGroupAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function GroupsIndex() {
  const navigate = useNavigate();
  return (
    <div>
      <Header active="g" />
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
