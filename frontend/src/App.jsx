import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className=' h-screen w-screen '>
      <ToastContainer />
      <NavBar />
      <Outlet/>
      <Footer />
    </div>
  )
}

export default App
