// import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getFiles,createNewFile } from "../api/files";
import { useNavigate } from "react-router-dom";



const DisplayFiles = () => {
const navigate = useNavigate();

type FileType = {
  
  fileid: string
  title: string
  createdAt: string
  updatedAt: string
  // add more fields if needed
}
    const [files, setFiles] = useState<FileType[]>([]);   
  const [loading, setLoading] = useState(false);
   

  useEffect(() => {
    fetchFiles();
  }, []);

const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await getFiles();  // assuming this returns a JSON array
      const normal = response.map((file:any):FileType=>({
        fileid:file.fileId,
        title:file.title,
        createdAt:file.createdAt,
        updatedAt:file.updatedAt,
      }))
      setFiles(normal);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handalCreateFile= async (title:string)=>{
    try{
const fileId = await createNewFile(title);
if(fileId === undefined) alert('file failed to create ')
     else  navigate(`/editorpage/${fileId}`)
    }catch(err){
      console.log("files could not be created ");
      console.error(err);
    }
  }

 



  return (<>
  
  {loading ? <span>Loading..</span>:
  <div>
    {files.map(file => (
          <div
            key={file.fileid}
            className="p-4  rounded shadow-sm hover:shadow-md transition  min-w-35 min-h-25 font-extrabold text-4xl brightness-75 hover:brightness-85 "
          >
            <h2 className="font-semibold text-lg">{file.title}</h2>
            <p className="text-sm text-gray-600">
              Created: {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

    </div>}

   
        <button  className="p-4  rounded shadow-sm hover:shadow-md transition-all bg-indigo-500   min-w-35 min-h-25 font-extrabold text-4xl brightness-75 hover:brightness-85 " onClick={()=>handalCreateFile('untitled')} >
 +
        </button>
  
  </>);
};
export default DisplayFiles;
