import React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"


//This component has not been made yet. More comments will be added when it is completed
class Leaderboards extends React.Component{
    constructor(){
        super()
        this.state = {

        }
    }

    handleSubmit(e){
        e.preventDefault();
    }

    render(){
        return(
            <div>
                <h1>Leaderboards</h1>
            </div>
        )

    }
}

export default Leaderboards