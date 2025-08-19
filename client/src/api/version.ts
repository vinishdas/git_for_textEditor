import axiosClient from '../hooks/axiosClient';
type Branch = {
  id: string
  name: string
}
type LatestVersionResponse = {
  versionId: string
  title: string
  tag: string | null
  chunklist: string[]
  content: string
  branchName:string
  branchList:Branch[]
}
export const latestVersion = async (fileId:string,branchId:string):Promise<LatestVersionResponse>  =>{
    const res = await axiosClient.get<LatestVersionResponse>(`/api/versionRoute/${fileId}/branches/${branchId}/latest`)
//   if (!res.ok) throw new Error('Failed to fetch')
// console.log( "api res" ,res.data.chunklist);
    return res.data
}

export const CreateChunk = async(chunkHash:string,content:string)=>{
  try {
    
      const res = await axiosClient.post(`/api/versionRoute/createchunk`,{chunkHash,content});
      return res.data;
  }catch(err){
    console.log("api request failed ");
  }
}


// ✅ aligned with backend createversion
export const CreateVersion = async (
  branchId: string,
  parentVersionId: string,
  updatedTag: string,
  fileId: string,
  newchunkHashes: string[]
) => {
  try {
    const res = await axiosClient.post(`/api/versionRoute/createversion`, {
      branchId,              // backend expects this
      versionId: parentVersionId, // maps to parentVersionId
      updatedTag,            // backend uses this to set tag
      fileId,
      newchunkHashes,
    });
    return res.data;
  } catch (err) {
    console.log("❌ could not do api call for creating version file", err);
  }
};

// ✅ aligned with smarter backend createBranch
export const CreateBranch = async (
  fileId: string,
  branchName: string,
  startFromVersionId: string,
  updateTag: string,
  newchunkHashes: string[],
  parentBranchId?: string // optional
) => {
  try {
    const res = await axiosClient.post("/api/versionRoute/createBranch", {
      fileId,
      branchName,
      startFromVersionId,
      parentBranchId: parentBranchId || null,
      tag: updateTag,
      newchunkHashes,
    });
    return res.data;
  } catch (err) {
    console.log("❌ could not create a new branch", err);
  }
};

 