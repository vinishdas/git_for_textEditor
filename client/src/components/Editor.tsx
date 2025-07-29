 import { useEffect,useState } from "react";
 import {latestVersion} from '../api/version'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type fileProps={
    fileId:string|null|undefined;
}
// type LatestVersionResponse = {
//   versionId: string
//   title: string
//   tag: string | null
//   chunkHashes: string[]
//   content: string
// }
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'code-block'],
    ['clean'],
  ],
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'image', 'code-block'
]

const Editor = ({fileId}:fileProps)=>{
    const [value, setValue] = useState<string>('')   
     const [chunkHashes, setChunkHashes] = useState<string[]>([])  
     const [versionId, setVersionId] = useState<string | null>(null)
      const [tag, setTag] = useState<string | null>(null)  
    


    useEffect(() => {
    const fetchLatest = async () => {
      if (!fileId) return
      try {
        const body = await latestVersion(fileId)
        setValue(body?.content || ''); // Adjust this line based on API shape
        setChunkHashes(body.chunkHashes||[]);
        setTag(body.tag||null)
        setVersionId(body.versionId||null)
      } catch (err) {
        console.error('Failed to fetch latest version:', err)
      }
      fetchLatest();
    }

    fetchLatest()
  }, [fileId])
return (<>
      <ul className="text-white text-xl border-2 rounded-2xl p-3 m-0 flex flex-col w-2/10 mx-auto">
        <li>chunkList :{chunkHashes}</li>
        <li>tag:{tag}</li>
        <li>fileVersion:{versionId}</li>
      </ul>
  <div className="max-w-[1300px]  mx-auto mt-10 p-6 bg-[#1e1e1e] rounded-2xl shadow-lg border border-neutral-800 transition-all duration-300">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4 opacity-95">Start Writing</h2>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        className="dark-quill  "
        placeholder="What's on your mind?"
      />
      
    </div>
</>)
}
export default Editor;