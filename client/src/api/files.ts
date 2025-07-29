import axiosClient from '../hooks/axiosClient';

export async function getFiles(){
   
    try{
        const res =  await axiosClient.get('/api/FileRoute/files',)
        return res.data;

    }catch(err){
        console.log(err);
        console.log("files not retriverd ")
    }
 
}
// export async function getFilesVersion(params:any) {
   

// }

export const  createNewFile= async (title:string) =>{
   
    try{
        const res= await axiosClient.post('/api/FileRoute/files',{title});
            return res.data.fileId;
            }catch(err)
            {
            console.log('files could not be fethed ')
            console.log(err);}
    

}