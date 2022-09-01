import React from "react";
import {Container,Button,Spinner,Row,Col, } from 'react-bootstrap'
import { connect } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setuser,clearuser } from "./actions/main";
import SidePanel from "./components/SidePanel/SidePanel";
import ColorPanel from "./components/ColorPanel/ColorPanel";

import MetaPanel from "./components/MetaPanel/MetaPanel";
import MessagePanel from "./components/MessagePanel/MessagePanel";


class App extends React.Component {

  componentDidMount() {
    console.log(this.props);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.props.setuser(user)
      } else {
        this.props.clearuser()
      }
    });
  }

  
  render() {
    return(
      this.props.isLoading 
      ?
        <>
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="visually-hidden">Loading...</span>
        </Button>{' '}
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
        </>
      :
        <Container fluid>
          <Row>
            <Col lg={1} style={{color: "#fff",background: "black", height: "100vh"}}>
              <ColorPanel/>
            </Col>

            <Col lg={2} style={{background: "#473FE1", height: "100vh"}}>
              <SidePanel/>
            </Col>

            <Col lg={7}>
              <MessagePanel/>
            </Col>

            <Col lg={2} style={{background: "#CBD4DB", height: "100vh"}}>
              <MetaPanel/>
            </Col>
          </Row>
        </Container>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return { 
    isLoading: state.user.isLoading 
  };
}

export default connect(mapStateToProps, {setuser, clearuser})(App)