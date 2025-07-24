import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import { motion} from 'framer-motion'

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signupUser({ email, password }); // calls your API
      if (res.signup === 1) {
        navigate("/login"); // ✅ redirect to login
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong");
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
      transition={{  duration: 0.4 }}
       
       
    >

        
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-8 rounded-xl shadow-xl bg-[#383737] flex flex-col gap-4 mt-30"
        >
        <h2 className="text-xl text-[#7e9efc] font-semibold mb-5 text-left">
          SIGN UP
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="bg-[#4a4848] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="bg-[#4a4848] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 px-4 rounded-md
          transition-all duration-300 ease-in-out
          hover:bg-[#7e9efc] hover:scale-105
          focus:scale-90
          hover:ring-2 hover:ring-indigo-300
          disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </form>
            </motion.div>
    </>
  );
};
export default Signup;
