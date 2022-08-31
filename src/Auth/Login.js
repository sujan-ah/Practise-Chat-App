import React from "react";
import { Container, Form, Button,Alert,Spinner } from 'react-bootstrap';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link}  from 'react-router-dom'

class Login extends React.Component {
    state={
        email: "",
        password: "",
        errorMessage: "",
        loader: false,
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    isFormEmty = ({email,password}) =>{
        if(!email || !password ){
            this.setState({errorMessage: "Please Fill The All Field"})
        }else if(password.length < 8){
            this.setState({errorMessage: "Password Should Be At Least 8 Corrector"})
        }else{
            return true
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        if(this.isFormEmty(this.state)){
            this.setState({loader: true})
            
            signInWithEmailAndPassword(getAuth(), this.state.email, this.state.password)
            .then((userCredential) => {
                console.log(userCredential);
                this.setState({loader: false})
            })
            .catch((error) => {
                this.setState({loader: false})
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                if(errorCode.includes("user")){
                    this.setState({errorMessage: "User Not Found"})
                    
                }else if(errorMessage.includes('wrong-password')){
                    this.setState({errorMessage: "Wrong Password"})
                }
            });
        }
    }

    render() {
        return (
            <Container className="w-25 border p-5 mt-5 shadow">
                {this.state.errorMessage &&
                    <Alert className="text-center" variant="danger">
                        <h3>{this.state.errorMessage}</h3>
                    </Alert>
                }

                <Alert className="text-center">
                    <h1>Login</h1>
                </Alert>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            name="email" 
                            type="email" 
                            placeholder="Enter email" 
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                    </Form.Group>
            
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            name="password"
                            type="password" 
                            placeholder="Password" 
                            onChange={this.handleChange}
                            value={this.state.password}
                        />
                    </Form.Group>
                    {this.state.loader 
                    ?
                        <Spinner animation="border" variant="info" />
                    :
                        <Button 
                            variant="primary" 
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>

                    }
                    

                    <Link className="ms-3 link" to="/register">
                        Sign Up
                    </Link>
                </Form>
            </Container>
        );
    }
}

export default Login