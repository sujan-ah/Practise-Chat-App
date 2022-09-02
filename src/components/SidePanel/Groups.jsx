import React, { Component } from 'react'
import { Container,Row,Col,Tab,Nav,Modal,Button,Form } from 'react-bootstrap'
import { BiPlusMedical } from 'react-icons/bi';
import { getDatabase, ref, push, set } from "firebase/database";

export default class Groups extends Component {
    state={
        modal: false,
        groupname: '',
        grouptagline: '',
    }

    handleModal = () =>{
        this.setState({modal: true})
    }
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        const db = getDatabase();
        const groupListRef = ref(db, 'group');
        const newGroupRef = push(groupListRef);
        set(newGroupRef, {
            createdby: this.props.userName,
            groupname: this.state.groupname,
            grouptagline: this.state.grouptagline,
            date: Date(),
            sender: this.props.user.uid,
        });
    }

    




  render() {
    // console.log(this.props.user.uid);
    return (
      <Container>
        <Row style={{fontSize: 20, color: "#fff", marginTop: 30}}>
            <Col>
                <h3>Group</h3>
            </Col>
            <Col style={{marginTop: 3, marginLeft: 80}}>
                <BiPlusMedical
                    onClick={this.handleModal} 
                />
            </Col>
        </Row>

        <Modal
            show={this.state.modal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Modal heading
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Label htmlFor="inputPassword5">Group Name</Form.Label>
                <Form.Control
                    name="groupname"
                    type="text"
                    placeholder="Group Name"
                    onChange={this.handleChange}
                />
                <Form.Label htmlFor="inputPassword5">Group Tagline</Form.Label>
                <Form.Control
                    name="grouptagline"
                    type="text"
                    placeholder="Group Tagline"
                    onChange={this.handleChange}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    onClick={this.handleSubmit}
                >
                    Add Group
                </Button>

                <Button 
                    onClick={()=> this.setState({modal: false})}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <Row>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    {/* <Col sm={12}> */}
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                        <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {/* </Col> */}
                    {/* <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            ami 
                        <Sonnet />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                        <Sonnet />
                        </Tab.Pane>
                    </Tab.Content>
                    </Col> */}
                </Row>
            </Tab.Container>
        </Row>
      </Container>
    )
  }
}
