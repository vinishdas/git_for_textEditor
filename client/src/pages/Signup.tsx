import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';

const Signup = () =>{
    
    const navigate = useNavigate(); 
   
   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
     try {
      const res = await signupUser({ email, password }) // calls your API
      if (res.signup === 1) {
        navigate('/login') // ✅ redirect to login
      } else {
        setError(res.message || 'Signup failed')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <form   onSubmit={handleSubmit}>
      <input className='p-2 w-1/2 text-black bg-[#f9f9f9]' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={loading}>Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  )



}
export default Signup