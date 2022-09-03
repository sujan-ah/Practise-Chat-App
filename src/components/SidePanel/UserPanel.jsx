import React, { Component } from 'react'
import { Dropdown,Modal,Button,ProgressBar,Image } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth";
import { storage } from "../../firebaseConfig"
import { getDatabase, ref as refer, push, set, child } from "firebase/database";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL 
} from "firebase/storage";
import { onChildAdded, onChildChanged,onChildRemoved,ref as rof } from "firebase/database";


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

    handleChange = (e) => {
        this.setState({file: e.target.files[0]})
    }
    
    handleUpload = () => {
        if (!this.state.file) {
            alert("Please upload an image first!");
        }
    
        const storageRef = ref(storage, `/files/${this.state.file.name}`);
    
        const uploadTask = uploadBytesResumable(storageRef, this.state.file);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
               
                // update progress
                this.setState({percent: percent})
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);

                    const db = getDatabase();
                    const profileListRef = refer(db, 'files');
                    const newProfileRef = (child(profileListRef, `${this.props.user.uid}`));
                    set(newProfileRef, {
                        fileUrl: url,
                        createdby: this.props.userName,
                        date: Date(),
                        sender: this.props.user.uid,
                    })
                    .then(() => {
                        console.log("Data saved successfully");
                        this.setState({profileup: true})
                        this.setState({percent: ''})
                        this.setState({modal: false})
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
            }
        );
    };

    
    componentDidUpdate(){
        let filearr = []
        const filesRef = rof(getDatabase(), 'files/');
        onChildAdded(filesRef, (data) => {
            filearr.push(data.val())
            if(this.state.profileup){
                this.setState({profile: filearr})
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
                                <Image style={{width: 60, height: 60,borderRadius: "50%",marginLeft: 13,marginBottom: 5}}  
                                    src={item.fileUrl}/>   
                            </div>
                        :
                        ""

                    ))}
                </div>

                <Dropdown style={{marginTop: 50, marginLeft: 100}}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Profile
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Logged As {this.props.userName}
                        </Dropdown.Item>

                        <Dropdown.Item
                            onClick={()=> this.setState({modal: true})}
                        >
                            Change Profile Pic
                        </Dropdown.Item>

                        <Dropdown.Item 
                            onClick={this.handleLogOut}
                        >
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
                        Upload Profile Picture
                    </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.state.percent > 0 &&
                            <ProgressBar className='mb-2' variant="success" now={this.state.percent} label={`${this.state.percent}%`} />
                        }
                        <input 
                            type="file" 
                            onChange={this.handleChange} 
                            accept="/image/*" 
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button 
                            onClick={this.handleUpload}
                        >
                            Upload
                        </Button>
                        <Button 
                            onClick={() => this.setState({modal: false})}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}
