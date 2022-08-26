import React from 'react'
import { Form,Button,Container,Alert } from 'react-bootstrap';
import { auth, createUserWithEmailAndPassword,updateProfile,getDatabase, ref, set  } from "../firebaseConfig";
import { ToastContainer, toast } from 'react-toastify';

class Register extends React.Component{
    state={
        username: "",
        email: "",
        password: "",
        Cpassword: "",
        errorMessage: "",
        successMessage: "",
        loader: false
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    isFormEmpty = ({username, email, password, Cpassword}) =>{
        if(!username.length || !email.length || !password.length || !Cpassword.length){
            this.setState({errorMessage: "Please Fill The All Field"})
        }else if(password.length < 8 || Cpassword.length < 8){
            this.setState({errorMessage: "Password Should be at least 8 Correcter"})
        }else if(password !== Cpassword){
            this.setState({errorMessage: "Password Doesn't Match"})
        }
        else{
            return true
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        if(this.isFormEmpty(this.state)){
            this.setState({loader: true})
            createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((user) => {
                updateProfile(auth.currentUser, {
                    displayName: this.state.username,
                })
                .then(() => {
                    this.writeUserData(user)
                })
                .then(()=>{
                    this.setState({username: ""})
                    this.setState({email: ""})
                    this.setState({password: ""})
                    this.setState({Cpassword: ""})
                    this.setState({errorMessage: ""})
                    this.setState({successMessage: "Account create Successful"})
                    this.setState({loader: false})
                })
                console.log(user);
                
            })
            .catch((error) => { 
                const errorCode = error.code;
                if(errorCode.includes("email")){
                    this.setState({errorMessage: "Email Already in use"})
                };
            });
        }
    }
    writeUserData(user) {
        const db = getDatabase();
        set(ref(db, 'users/' + user.user.uid), {
          username: this.state.username,
        });
    }

    render(){
        return (
            <Container className='w-25 border p-5 mt-5 shadow'>
                <Alert className='text-center'>
                    <h1>Registration</h1>
                </Alert>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>UserName</Form.Label>
                        <Form.Control 
                            name="username"
                            type="text" 
                            placeholder="First Name" 
                            onChange={this.onChange}
                            value={this.state.username}
                        />
                    </Form.Group>
        
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            name="email"
                            type="email" 
                            placeholder="Enter email" 
                            onChange={this.onChange}
                            value={this.state.email}
                        />
                    </Form.Group>
        
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password" 
                            type="password" 
                            placeholder="Password" 
                            onChange={this.onChange}
                            value={this.state.password}
                        />
                    </Form.Group>
        
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            name="Cpassword"
                            type="password" 
                            placeholder="Password"
                            onChange={this.onChange}
                            value={this.state.Cpassword} 
                        />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    {this.state.errorMessage &&
                        <Alert variant="danger mt-4 text-center">
                            <h4>{this.state.errorMessage}</h4>
                        </Alert>
                    }
                    {this.state.successMessage &&
                        <Alert variant="success mt-4 text-center">
                            <h4>{this.state.successMessage}</h4>
                        </Alert>
                    }
                </Form>
            </Container>
        )
    }
}

export default Register