import React, { Component } from 'react'
import { Dropdown,Modal,Button,ProgressBar } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth";
import { storage } from "../../firebaseConfig"
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

        profile: []
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

                    
                });
            }
        );
    };
    

    render() {
        // console.log(this.props.userName);
        return (
            <>
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
