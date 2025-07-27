// import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import DisplayFiles from "../components/DisplayFiles";

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigator = useNavigate();

  //   const [loading, setLoading] = useState(true)
  //   const [error, setError] = useState<string | null>(null)

  const handalLogout = () => {
    try {
      logout();
      navigator("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav className="boorder-2 border-amber-500 text-white   mt-5 items-center w-full h-3/25  flex justify-between">
        <span className="ml-3 text-3xl font-bold text-indigo-400">
          Tailblocks
        </span>

        <button
          onClick={handalLogout}
          className="rounded-md mr-3 bg-red-400 p-3 w-20 sm:w-30   font-medium    hover:shadow-md shadow-red-300/30 hover:font-bold transistion-all  text-sm sm:text-base "
        >
          Logout
        </button>
      </nav>
      <div className="bg-[#242424] rounded-md brightness-150 w-[95%] max-w-[1250px] min-h-[500px] mt-16 mx-auto shadow-xl p-3">
        <div className="text-xl sm:text-2xl font-semibold text-center py-2 text-white ">
          Explore your Files
        </div>

        <div className="flex flex-wrap gap-6 mt-2 ">
          <DisplayFiles />
        </div>
       
      </div>
    </>
  );
};

export default DashboardPage;
