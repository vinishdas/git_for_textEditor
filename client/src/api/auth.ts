import axios from 'axios'

export async function loginUser(email: string, password: string){
 const res = await fetch('/api/auth/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email,password}), 
 });
 if(!res.ok) throw new Error('Invalid email or password');
 const data = await res.json(); 
 return data.token;

 
}

export async function signupUser(data: { email: string; password: string }){
const res = await axios.post('/api/auth/signup', data)
 return res.data;

}