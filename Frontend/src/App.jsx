import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pagenotfound from './pages/PagenotFound'
import Userdata from './pages/Userdata'

function App() {
  return (<div>
    <BrowserRouter>
    <Routes>
        <Route path='/' exact Component={Home}></Route>
        <Route path='/login' exact Component={Login}></Route>
        <Route path='/register' exact Component={Register}></Route>
        <Route path='/dashboard' exact Component={Dashboard}></Route>
        <Route path='/Userdata' exact Component={Userdata}></Route>
        <Route path='/*' exact Component={Pagenotfound}></Route>
    </Routes>
    </BrowserRouter>
</div>)
}

export default App
