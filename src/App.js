import React from "react";
import {Container} from 'react-bootstrap'
import { connect } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setuser } from "./actions/main";


class App extends React.Component {

  componentDidMount() {
    console.log(this.props);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.props.setuser(user)
      } else {
        // User is signed out
        // ...
      }
    });
  }

  
  render() {
    return(
      <Container>
        
        <h1>React</h1>
      </Container>
      
    );
  }
}


export default connect(null, {setuser})(App)