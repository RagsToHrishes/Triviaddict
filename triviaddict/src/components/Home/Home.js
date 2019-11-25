//importing libraries and other components to render them. Also a router to go between each component
import React from "react"
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import Login from "../Login/Login"
import Setting from"../Settings/Settings"
import Navbar from "../Navbar/Navbar"
import Game from "../Game/Game"
import Leaderboards from "../Leaderboards/Leaderboards"


//Home component, renders a list to go between each component (Temporary intill Login page is finished)
class Home extends React.Component{
    constructor(){
        super()
        this.state = {

        }
    }

    /*render function displays the JSX below onto the webpage
    Router element makes it able to go between components
    Navbar element hold the routes to the other components
    The Switch and Route handles the connections with the Navbar
    */
    
    render(){
        return(
        <Router>
            <div className="container">
                <Navbar/>
                <br/>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/settings" component={Setting} />
                    <Route exact path="/game" component={Game} />
                    <Route exact path="/leaderboards" component={Leaderboards} />
                </Switch>
            </div>
        </Router>
        )
    }
}

export default Home

