// import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getFiles } from "../api/files";



const DisplayFiles = () => {
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


  return (<>
  
  {loading ? <span>Loading..</span>:
  <div>
    {files.map(file => (
          <div
            key={file.fileid}
            className="p-4 border rounded shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{file.title}</h2>
            <p className="text-sm text-gray-600">
              Created: {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
    </div>}
  
  
  </>);
};
export default DisplayFiles;
