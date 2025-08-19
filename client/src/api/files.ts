import axiosClient from '../hooks/axiosClient';

export async function getFiles() {
  try {
    const res = await axiosClient.get("/api/FileRoute/files");

    // The backend always returns { success, count, files }
    if (res.data?.success) {
      return res.data;  
    } else {
      console.error("❌ Failed to fetch files:", res.data?.error || "Unknown error");
      return { success: false, count: 0, files: [] };
    }
  } catch (err) {
    console.error("❌ Error fetching files:", err);
    return { success: false, count: 0, files: [] };
  }
}

// export async function getFilesVersion(params:any) {
   

// }

export const  createNewFile= async (title:string) =>{
   
    try{
        const res= await axiosClient.post('/api/FileRoute/files',{title});
            return res.data;
            }catch(err)
            {
            console.log('files could not be fethed ')
            console.log(err);}
    

}
export const changeTitle = async (title: string, fileId: string): Promise<string> => {
  try {
    const res = await axiosClient.post('/api/FileRoute/file/title', { title, fileId });
    return res.data?.message || "Title updated";
  } catch (err) {
    console.error("Failed to change title:", err);
    throw new Error("Could not change title");
  }
};
