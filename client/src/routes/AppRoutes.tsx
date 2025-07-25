import { Routes,Route,useLocation } from "react-router-dom"
import Login from "../pages/Login"
// import EditorPage  from '../pages/EditorPage'
import Signup from '../pages/Signup'
import PrivateRoute  from '../routes/PrivateRoute'
import { AnimatePresence } from "framer-motion"
// import History from '../pages/History'
import DashboardPage from '../pages/DashboardPage.tsx'

const AppRoutes = ()=> {
     const location = useLocation()
    return (
        <>
          <AnimatePresence mode="wait">

        <Routes location={location} key={location.pathname}>
        <Route path ='/login' element ={<Login/>} /> 
        <Route path = '/signup' element = {<Signup/>}/>

        <Route element = {<PrivateRoute/>}>
            <Route path = '/dashboardPage' element={<DashboardPage/>}/>
            {/* <Route path= '/editorpage' element={<EditorPage/>}/> */}
            {/* <Route path ='/history' element={<History/>}/> */}
        </Route>
         <Route path="/" element={<Login />} /> // fallback page 
        
        </Routes>
          </AnimatePresence>
        </>
    )
}
export default AppRoutes