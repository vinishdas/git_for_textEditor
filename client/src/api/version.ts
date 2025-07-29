import axiosClient from '../hooks/axiosClient';
type LatestVersionResponse = {
  versionId: string
  title: string
  tag: string | null
  chunkHashes: string[]
  content: string
}
export const latestVersion = async (fileId:string):Promise<LatestVersionResponse>  =>{
    const res = await axiosClient<LatestVersionResponse>(`/api/versionRoute/${fileId}/latest`)
//   if (!res.ok) throw new Error('Failed to fetch')
    return res.data
}