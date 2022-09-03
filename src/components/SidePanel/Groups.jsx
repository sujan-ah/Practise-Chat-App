import React, { Component } from 'react'
import { Container,Row,Col,Tab,Nav,Modal,Button,Form,Alert,Card } from 'react-bootstrap'
import { BiPlusMedical } from 'react-icons/bi';
import { getDatabase, ref, push, set } from "firebase/database";

import {  ref as rof, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";


export default class Groups extends Component {
    state={
        modal: false,
        groupname: '',
        grouptagline: '',
        error: "",
        groupbox: [],
        groupup: true,
    }

    handleModal = () =>{
        this.setState({modal: true})
    }
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    }
    isFormValid = ({groupname,grouptagline}) =>{
        if(!groupname || !grouptagline){
            this.setState({error: "Please Fill The All Field"})
        }else{
            return true
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        if(this.isFormValid(this.state)){
            const db = getDatabase();
            const groupListRef = ref(db, 'group');
            const newGroupRef = push(groupListRef);
            set(newGroupRef, {
                createdby: this.props.userName,
                groupname: this.state.groupname,
                grouptagline: this.state.grouptagline,
                date: Date(),
                sender: this.props.user.uid,
            })
            .then(() => {
                this.setState({modal: false})
                this.setState({groupname: ""})
                this.setState({grouptagline: ""})
                this.setState({error: ""})
                
            })
        }
    }

    componentDidMount(){
        let groupfileArr = []
        const commentsRef = rof(getDatabase(), 'group/');
        onChildAdded(commentsRef, (data) => {
            groupfileArr.push(data.val())
            if(this.state.groupup){
                this.setState({groupbox: groupfileArr})
                this.setState({groupup: false})
            }
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
                {this.state.error &&
                    <Alert className='mt-2 text-center' variant="danger">
                        <h5>{this.state.error}</h5>
                    </Alert>
                }
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

        <Card style={{height: 150, overflowY: "scroll"}}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Nav variant="pills" className="flex-column">
                        {this.state.groupbox.map((item, index)=>(
                            <Nav.Item>
                            <Nav.Link eventKey={index}>{item.groupname}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Row>
            </Tab.Container>
        </Card>
      </Container>
    )
  }
}
