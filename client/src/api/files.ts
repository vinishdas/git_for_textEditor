import axios from 'axios'

export async function getFiles(){
    const token = localStorage.getItem('token')
    try{
        const res =  await axios.get('/api/files',{
            headers:{
                'Authorization':`Bearer ${token}`
            },
        })
        return res.data;

    }catch(err){
        console.log(err);
        console.log("files not retriverd ")
    }
 
}