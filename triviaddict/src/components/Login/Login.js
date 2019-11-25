import React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"

//Unfinished component but JSX so far is explained below
class Login extends React.Component{
    constructor(){
        super()
        this.state = {

        }
    }

    handleSubmit(e){
        e.preventDefault();
    }

    /*
        JSX so far has:
            - some h1 elements to display text
            - a form with a username, password text fields and submit button
            - The submit button, when clicked, runs the handle submit function
    */
    render(){
        return(
            <div>
                <h1>Triviaddict</h1>
                <h1 id="login">Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                    type="text" 
                    name="username" 
                    placeholder="username" 
                    />
                    <br/><br/>
                    <input
                    type="password" 
                    name="password" 
                    placeholder="password" 
                    />
                    <br/><br/><br/>
                    <input type="submit" value="Login"/>
                </form>
                <br/><br/><br/>
                <button>Register</button>
            </div>
        )

    }
}

export default Login