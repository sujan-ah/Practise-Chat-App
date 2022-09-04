import React, { Component } from 'react'
import { Container,Row,Col,Tab,Nav,Modal,Button,Form,Card,Alert } from 'react-bootstrap'
import { BiPlusMedical } from 'react-icons/bi';
import { getDatabase, ref, push, set,onValue } from "firebase/database";
import { connect } from 'react-redux';
import { setgroup } from '../../actions/main'


class Groups extends Component {
    state={
        modal: false,
        groupname: '',
        grouptagline: '',
        err: "",

        groups: [],
        active: '',
        firstload: true,
    }

    handleModal = () =>{
        this.setState({modal: true})
    }
    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    }

    isFormValid = ({groupname,grouptagline}) =>{
        if(groupname && grouptagline){
            return true
        }else{
            return false
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
            
            }).then(()=>{
                this.setState({modal: false})
                this.setState({groupname: ""})
                this.setState({grouptagline: ""})
                this.setState({err: ""})
            })
        }else{
            this.setState({err: "Please Fill The Information Box"})
        }
    }

    componentDidMount(){
        
        const db = getDatabase();
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let groupsafterload = []

            snapshot.forEach(item =>{
                let groupdata = {
                    id: item.key,
                    groupname: item.val().groupname,
                    grouptagline: item.val().grouptagline,
                    createdby:  item.val().createdby,
                }
                groupsafterload.push(groupdata)
            })
            this.setState({groups: groupsafterload}, this.addgroupafterload)
        });
    }

    addgroupafterload = () =>{
        let firstgroup = this.state.groups[0]
        if(this.state.firstload && this.state.groups.length > 0){
            this.props.setgroup(firstgroup)
            this.setState({active: firstgroup.id})
        }
        this.setState({firstload: false})
    }

    groupchange = (group) =>{
        this.props.setgroup(group)
        this.setState({active: group.id})
    }

   
    

  render() {
    // console.log(this.props.user.uid);
    return (
      <Container>
        <Row style={{fontSize: 20, color: "#fff", marginTop: 30, marginLeft: 1}}>
        
            <h4>
                Group ({this.state.groups.length})

                <BiPlusMedical
                    style={{marginTop: 0, marginLeft: 100}}
                    onClick={this.handleModal} 
                />
            </h4>
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

            {this.state.err ?
                <Alert variant="danger">
                    {this.state.err}
                </Alert> : ""
            }

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

        <Row style={{marginTop: 20}}>
        <Card style={{height: "150px", overflowY: "scroll", width: "80%",marginLeft: 26,background: "#fff" }}>
        
            {this.state.groups.map((item)=>(
        
                <h5 
                    style={this.state.active == item.id ? menuactive : menu}
                    onClick={()=>this.groupchange(item)}
                >
                    {item.groupname}
                </h5>

            ))}
     
        </Card>
        </Row>
      </Container>
    )
  }
}

let menuactive ={
    background: "green",
    padding: 10,
    color: "#fff",
    fontSize: 30,
    borderRadius: 10,
    textAlign: "center",
}
let menu ={
    background: "",
    marginTop: 10,
}




export default connect(null, { setgroup })(Groups)
