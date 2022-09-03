import React, { Component } from 'react'
import { Dropdown,Modal,Button,ProgressBar,Image,FormControl,InputGroup } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth";
// import { storage } from "../../firebaseConfig"
// import { storage,getDatabase, ref as refer, push,child, set,onChildAdded } from "firebase/database";
import { onChildAdded, onChildChanged,onChildRemoved,ref as rof } from "firebase/database";
import { storage,getDatabase, push, set,child, ref as refer } from '../../firebaseConfig'
import {
    ref,
    uploadBytesResumable,
    getDownloadURL 
} from "firebase/storage";



export default class UserPanel extends Component {
    state={
        modal: false,
        imageAsFile: '',
        imageAsUrl: '',

        file: "",
        percent: 0,

        profile: [],
        profileup: true,
    }

    handleLogOut = (e) =>{
        e.preventDefault()
        const auth = getAuth();
        signOut(auth).then(() => {
          console.log("sign out");
        }).catch((error) => {
          console.log(error);
        })
    }

    openModal = () =>{
        this.setState({modal: true})
    }
    closeModal = () =>{
        this.setState({modal: false})
    }

    handleImage = (e) => {
        this.setState({file: e.target.files[0]})
    }
    

    handleUpload = () =>{
        if(this.state.file){
            let storageRef = ref(storage, `files1/${this.state.file.name}`)
            let uploadtask = uploadBytesResumable(storageRef, this.state.file)
            uploadtask.on("state_changed", (snapshot)=>{
                let percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                this.setState({percent: percent})
                console.log(this.state.percent)
            },(err)=>{
                console.log(err)
            },()=>{
                getDownloadURL(uploadtask.snapshot.ref).then((url)=>{
                    console.log(url)

                    const groupsRef = refer(getDatabase(), 'files1');
                    const newGroup = (child(groupsRef, `${this.props.user.uid}`));
                    set(newGroup, {
                        fileurl: url,
                        date: Date(),
                        sender: this.props.user.uid,
                        username: this.props.userName
                    }).then(()=>{
                        this.setState({profileup: true})
                        this.setState({modal: false})
                        this.setState({percent: ""})
                        console.log("file geche db e")
                    }).catch(err=>{
                        // console.log("ami")
                    })
                })
            })
        }else{
            console.log("data nai")
        }
    }
    
    
   
    componentDidUpdate(){
        let filearr = []
        const filesRef = rof(getDatabase(), 'files1/');
        onChildAdded(filesRef, (data) => {
            // console.log(data.val());
            filearr.push(data.val())
            // console.log(filearr);
            if(this.state.profileup){
                this.setState({profile: filearr})
                // console.log(this.state.profiles);
                this.setState({profileup: false})
            }
        });
    }
    
    

    render() {
        // console.log(this.props.user.uid);
        return (
            <>
                <div>
                    {this.state.profile.map((item)=>(
                        item.sender == this.props.user.uid
                        ?
                        <div>
                        {/* <Image style={{width: 60, height: 60,borderRadius: "50%",marginLeft: 13,marginBottom: 5}}  
                            src={item.fileurl}/>    */}
                    </div>
                        :
                        ""
                    ))}
                </div>

                <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                                Loged As {this.props.userName} 
                            </Dropdown.Item>
                            <Dropdown.Item 
                                href="#/action-2"
                                onClick={this.openModal}
                            >
                                Change Profile Pic
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-3" onClick={this.handleLogOut}>
                                Log Out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                <Modal
                show={this.state.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {/* <FontAwesomeIcon style={{color: "#0B5ED7", fontSize: 70,marginLeft: 350}} icon={faUsers} /> */}
                    <h1 style={{marginLeft: 250,fontSize: 30}}>
                        Upload Profile Picture
                    </h1>
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body style={{marginTop: 10}}>
                    <InputGroup style={{width: 300}}>
                        <InputGroup.Text>
                            {/* <FontAwesomeIcon  icon={faUpload} /> */}
                        </InputGroup.Text>
                        <FormControl
                            onChange={this.handleImage} 
                            type="file" 
                            icon='upload' 
                            placeholder='Search...'
                        />
                    </InputGroup>
                    
                    {this.state.percent ?
                        <ProgressBar now={this.state.percent} label={`${this.state.percent}%`} /> : ""
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        onClick={this.handleUpload}
                        variant="primary" 
                    >
                        Upload
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={this.closeModal}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
            </>
        )
    }
}
