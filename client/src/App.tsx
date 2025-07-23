import { BrowserRouter } from "react-router-dom"
import {AuthProvider} from "./context/AuthContext"
import AppRoutes from './routes/AppRoutes'

function App() {
   

  return (
    <>
       <BrowserRouter>
       <AuthProvider>
        <AppRoutes>
          
        </AppRoutes>
       </AuthProvider>
       </BrowserRouter>
    </>
  )
}

export default App
