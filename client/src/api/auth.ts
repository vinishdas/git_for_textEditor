import axios from 'axios'

// export async function loginUser(email: string, password: string){
//  const res = await fetch('/api/auth/login',{
//     method:'POST',
//     headers:{'Content-Type':'application/json'},
//     body: JSON.stringify({email,password}), 
//  });
//  if(!res.ok) throw new Error('Invalid email or password');
//  const data = await res.json(); 
//  return data.token;

 
// }
export async function loginUser(email: string, password: string ) {
  try {
    const res = await axios.post('/api/auth/login', {email,password});
    return res.data.token; // assuming the server returns { token: '...' }
  } catch (err: any) {
    // Handle error response from the backend
    if (err.response && err.response.data && err.response.data.message) {
      console.log(err.response)
      throw new Error(err.response.data.message);
    }
    throw new Error('Invalid email or password');
  }
}


export async function signupUser(data: { email: string; password: string }){
const res = await axios.post('/api/auth/signup', data)
 return res.data;

}