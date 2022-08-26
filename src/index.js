import React  from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Register from './Auth/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Routing extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ToastContainer position="bottom-center"/>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Routing />);