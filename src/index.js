import React  from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import Register from './Auth/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Auth/Login';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/main' 

const store = createStore(rootReducer,composeWithDevTools());


class Routing extends React.Component {
  state = {
    tracker: false
  }

  componentDidMount() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        this.setState({tracker: true})
      } else {
        this.setState({tracker: false})
      }
    });
  }
  

  render() {
    return (
      <Router>
        {this.state.tracker
        ?
          <Routes>
            <Route path="/" element={<App />} ></Route>
            <Route path="/register" element={<Navigate to="/" />} ></Route>
            <Route path="/login" element={<Navigate to="/" />} ></Route>
          </Routes>
        :
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/login" element={<Login />} ></Route>
          </Routes>
        }
          
      </Router>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Routing />
  </Provider>,
);