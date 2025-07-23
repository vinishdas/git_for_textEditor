import { Routes,Route } from "react-router-dom"
import Login from "../pages/Login"
import EditorPage  from '../pages/EditorPage'
import Signup from '../pages/Signup'
import PrivateRoute  from '../routes/PrivateRoute'
import History from '../pages/History'


const AppRoutes = ()=> {
    return (
        <>
        <Routes>
        <Route path ='/login' element ={<Login/>} /> 
        <Route path = '/signup' element = {<Signup/>}/>

        <Route element = {<PrivateRoute/>}>
            <Route path= '/editorpage' element={<EditorPage/>}/>
            <Route path ='/history' element={<History/>}/>
        </Route>
         <Route path="*" element={<Login />} /> // fallback page 
        
        </Routes>
        </>
    )
}
export default AppRoutes