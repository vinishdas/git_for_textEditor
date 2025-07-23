import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/auth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const {login} = useAuth(); 
    const navigate = useNavigate();

      const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try{

        const token  = await loginUser(email,password);
        login(token);
        navigate('/editor');
    }catch(err:any){
        setError(err.message);
    }finally{
        setLoading(false);
    }
    };
return (
    <>
    <form className='border-2 border-red-500' onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p >{error}</p>}
        <input 
        type = "email"
        value = {email}
        onChange={e => setemail(e.target.value)}
        placeholder='email'
        required />
        <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
     <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </form>
    </>
)
}
export default Login