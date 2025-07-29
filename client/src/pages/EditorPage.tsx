import { useParams } from "react-router-dom";
 
 
import Editor from '../components/Editor'

const EditorPage = () =>{
     
    const {fileId}=useParams<{fileId:string}>();
     
    return (
    <>
    <h1 className="text-white text-[50px] mb-10">Text Editor page </h1>
    <Editor fileId={fileId}></Editor>
    </>    
    )
}
export default EditorPage;