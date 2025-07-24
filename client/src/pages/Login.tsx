import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("login not possible ");
    try {
      const token = await loginUser(email, password);
      login(token);
      navigate("/editor");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    

      <h1 className="text-4xl font-bold text-center text-[#7e9efc] mt-10 mb-6">
        SnapEdit
      </h1>
      <motion.div
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0.5, x: 200 }}
      transition={{   duration: 0.4 }}
      
       
    >

      <form
        className="max-w-md mx-auto  p-8 rounded-xl shadow-xl  bg-[#383737]    flex flex-col gap-4 mt-30"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl text-[#7e9efc] text-left font-semibold  mb-5 ">
          LOGIN
        </h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Email"
          required
          className="    bg-[#4a4848] text-white px-4 py-3 rounded-md focus:border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 "
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="  bg-[#4a4848] text-white px-4 py-3 rounded-md focus:border-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className=" bg-black text-white py-3 px-4 rounded-md
    transition-all duration-300 ease-in-out
    
    hover:bg-[#7e9efc] hover:scale-105
    focus:scale-90
    hover:ring-2 hover:ring-indigo-300
    disabled:opacity-50 disabled:cursor-not-allowed"
    >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
          </motion.div>
    </>
  );
};
export default Login;
