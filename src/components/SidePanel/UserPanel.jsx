import React, { Component } from 'react'
import {Dropdown} from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth";

export default class UserPanel extends Component {


    handleLogOut = (e) =>{
        e.preventDefault()
        const auth = getAuth();
        signOut(auth).then(() => {
          console.log("sign out");
        }).catch((error) => {
          console.log(error);
        })
    }
    


    render() {
        return (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            Profile
            </Dropdown.Toggle>
    
            <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Logged As Sujan</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Change Profile Pic</Dropdown.Item>
            <Dropdown.Item 
                onClick={this.handleLogOut}
            >
                Log Out
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        )
    }
}
