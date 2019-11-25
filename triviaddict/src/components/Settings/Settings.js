import React from "react"
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import axios from "axios";

class Settings extends React.Component{
    //State is storing the properties inputted by the user
    constructor(){
        super()
        this.state = {
            numOfQ: 0,
            difficulty: "",
            topic: ""
        }

        //this is to make sure that the setState function works (scope issues)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    //function that when any form element is changed, it is saved in state
    handleChange(e){
        let {name, value} = e.target
        this.setState({
            [name]: value
        })
    }

    //when the submit buttion is pressed, the state is then sent to update the preferences of the user in the MongoDB database
    //this link is provided by the backend
    handleSubmit(e){
        e.preventDefault();
        console.log(this.state);

        axios.post("/user/updateprefs/hrish", this.state)
    }

    /*
        JSX explained:
        (Btw, if you want to see what the JSX looks like, just look at Criterion B or run the product)
        - h1 element with the title
        - form element which holds:
            - a textfield with it's own label (heading) to take user's number
            - A select bar with it's own label and three options
            - Another select bar with it's own label and all the topics offered as options
        - A submit button that when clicked runs the handleSubmit function

        The styling is just used to make the displayed output look much cleaner and positoned better
    */
    render(){
        return(
        <div>
            <h1 style={
                {
                    fontSize: 50,
                    position: "relative",
                    top: 0
                }
            }>Settings</h1>
            <form onSubmit={this.handleSubmit}
                style={{
                position: "relative",
                top: 0
                
            }}>
                <label style={{
                    position: "relative",
                    top: 60,
                    left: "33%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25
                    }
                }>
                  Number of questions:
                <input style={{
                    position: "relative",
                    top: 0,
                    left: 30
                }}
                    type="text"
                    placeholder="Num. of questions"
                    name="numOfQ"
                    onChange={this.handleChange}
                />
                </label>
                <br/><br/>
                <label style={{
                    position: "relative",
                    top: 60,
                    left: "33%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25
                    }
                }>
                  Question difficulty:
                <select 
                    value={this.state.difficulty}
                    selected={this.state.difficulty}
                    name="difficulty" 
                    style={{
                        position: "relative",
                        top: 0,
                        left: 30
                    }}
                    onChange={this.handleChange}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                </label>
                <br/><br/>
                <label style={{
                    position: "relative",
                    top: 60,
                    left: "33%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25
                    }
                }>
                  Question topics:
                <select 
                    value={this.state.topic}
                    selected={this.state.topic}
                    name="topic" 
                    style={{
                        position: "relative",
                        top: 0,
                        left: 30,
                        width: 150
                    }}
                    onChange={this.handleChange}
                >
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Entertainment: Books">Entertainment: Books</option>
                    <option value="Science & Nature">Science and Nature</option>
                    <option value="Geography">Geography</option>
                    <option value="Mythology">Mythology</option>
                    <option value="Art">Art</option>
                    <option value="History">History</option>
                    <option value="Entertainment: Musicals & Theaters">Entertainment: Musicals and Theaters</option>
                </select>
                </label>
                <br/><br/>
                <input type="submit" style={{
                    color: "white",
                    fontSize: 32,
                    position: "relative",
                    top: 100,
                    left: "55%",
                    width: 150, 
                }}
                />
            </form>
        </div>
        )
    }
}

export default Settings

