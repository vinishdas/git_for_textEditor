// import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
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
        <h2 className="mt-10 ml-3 text-2xl sm:text-5xl font-bold tracking-wider   mb-3" >Explore your Files</h2>
        <div className="container mx-auto px-4">
         
           <div className="flex flex-warp gap-6">
             <DisplayFiles></DisplayFiles>
            </div>
        </div>
    </>
  );
};

export default DashboardPage;
