import React from "react";
import axios from "axios";

// This component can be said to be the main part of the application
// It holds the actual trivia game and uses the backend extensively to run the application
class Game extends React.Component{

    //The constructor holds the state which stores all the information that will be used in this component
    constructor(){
        super()
        //All the values you see below are just placeholder values
        this.state = {

            //Settings gathered from the database that is used to alter how and what kind of questions are gathered
            strengths: {},
            numOfQ: 10,
            topic: "nothing",
            difficulty: "easy",

            //The Api assigns each category name to a number, so this is just a way to store that information
            catID: {
                "General Knowledge": 9,
                "Science & Nature": 17,
                "Geography": 22,
                "Mythology": 20,
                "Art": 25,
                "History": 23,
                "Entertainment: Musicals & Theatres": 13,
                "Entertainment: Books": 10
            },

            //Storing the questions gathered from the trivia database
            questions: {},

            //Storing the options for the current question
            options: [],

            //Storing information for each question displayed and keeping track of what the user has chosen so far
            currentQn: 1,
            currentOpChosen: -1,
            currentSesCorrectAns: -1,
            currQtopic: "",
            gotCorrect: "(-_-)",
            Qtype: "topic",

            //Keeping track of what session the user is on
            session: 1,

            //Keeping track of which category of questions the user got right and wrong plus how much of each category
            correctans: {},
            wrongans: {},

            //The session token used so that the questions don't repeat when gathered from the trivia database
            sessionToken: "",
        }

        //this is just to make all the setState (this function is what changes the state) calls in these functions work (scope issues)
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeTopic = this.changeTopic.bind(this);
    }


    //Making this an async function allows me to wait till all the data is gathered from the respective databases before moving on with other code
    //This is done through the keyword "await" which does what it says
    //This function is run right after this component has loaded and is also called everything a session finishes
    async componentDidMount(){
        //Checking if it's the first session to get a session token to ensure new questions everytime
        if(this.state.session == 1){
            await axios.get("https://opentdb.com/api_token.php?command=request").then(res => {
                this.setState({
                    sessionToken: res.data.token
                })
        })}

        //If the user wants questions based on the topic he chose:
        if(this.state.Qtype == "topic"){

            //first getting the settings from the user through the backend server and storing it in state
            axios.get("/user?username=hrish").then(res => {
            this.setState({
                strengths: res.data[0].strengths,
                numOfQ: res.data[0].prefs.numOfQ,
                topic: res.data[0].prefs.topic,
                difficulty: res.data[0].prefs.difficulty,
            })

            //Calling the trivia database suing url parameters to change what questions to get based on user preferences
            axios.get("https://opentdb.com/api.php?amount=" + this.state.numOfQ + "&category=" + this.state.catID[this.state.topic] + "&difficulty=" + this.state.difficulty + "&type=multiple" + "&token=" + this.state.sessionToken).then(res => {
                this.setState({
                    questions: res.data.results
                })
                let questions = this.state.questions;
                let curQ = this.state.currentQn - 1;
                let options = []
                //Setting up the options for the first question
                for(let op in questions[curQ].incorrect_answers){
                    options.push(questions[curQ].incorrect_answers[op])
                }
                options.push(questions[curQ].correct_answer)
                options = shuffle(options);

                let topic = questions[curQ].category
                let corAns = options.indexOf(questions[curQ].correct_answer);

                //Saving everything about the current question to state
                this.setState({
                    options: options,
                    currentCorrectAns: corAns + 1,
                    currQtopic: topic
                })
            })
        })

        //If the user wants questions based on their skills:
        }else{

            //This object keeps track of how many questions from each category is needed for the next session
            let topicQnum = {
                "General Knowledge": 0,
                "Science & Nature": 0,
                "Geography": 0,
                "Mythology": 0,
                "Art": 0,
                "History": 0,
                "Entertainment: Musicals & Theatres": 0,
                "Entertainment: Books": 0
            }
        
            //Variable to make probability math easier
            let totalweight = 0
            for(let i in this.state.strengths){
                totalweight = totalweight + this.state.strengths[i]
            }
        
            //Object to keep track of the weighted probabilities for each category when choosing next set of questions
            let weightedCategory = {
                "General Knowledge": (1-(this.state.strengths["General Knowledge"] / totalweight)) * 100,
                "Science & Nature": (1-(this.state.strengths["Science & Nature"] / totalweight)) * 100,
                "Geography": (1-(this.state.strengths["Geography"] / totalweight)) * 100,
                "Mythology": (1-(this.state.strengths["Mythology"] / totalweight)) * 100,
                "Art": (1-(this.state.strengths["Art"] / totalweight)) * 100,
                "History": (1-(this.state.strengths["History"] / totalweight)) * 100,
                "Entertainment: Musicals & Theatres": (1-(this.state.strengths["Entertainment: Musicals & Theatres"] / totalweight)) * 100,
                "Entertainment: Books": ((1-this.state.strengths["Entertainment: Books"] / totalweight)) * 100
            };

            //Filling how many questions per topic based on the weightedCategory object
            for(let i = 0; i < this.state.numOfQ; i++){
                topicQnum[get(weightedCategory)]++
            }
        
            //Insantiating a questions variable to store questions gathered
            let questions = []
    
            //For each category in topicQnum, a call is made to get that many questions and then storing in the questions variable
            for(let i in topicQnum){
                if(topicQnum[i] != 0){
                    await axios.get("https://opentdb.com/api.php?amount=" + topicQnum[i] + "&category=" + this.state.catID[i] + "&difficulty=" + this.state.difficulty + "&type=multiple" + "&token=" + this.state.sessionToken).then(res => {
                        for(let i in res.data.results){
                            questions.push(res.data.results[i])
                        }
                    })
                } 
            }

            //Storing questions to state
            this.setState({
                questions: questions
            })


            questions = this.state.questions;
            let curQ = this.state.currentQn - 1;
            let options = []

            //Setting up options for the first question
            for(let op in questions[curQ].incorrect_answers){
                options.push(questions[curQ].incorrect_answers[op])
            }
            options.push(questions[curQ].correct_answer)
            options = shuffle(options);

            let topic = questions[curQ].category
            let corAns = options.indexOf(questions[curQ].correct_answer);

            //Storing everything about the currect question to state
            this.setState({
                options: options,
                currentCorrectAns: corAns + 1,
                currQtopic: topic
            })
        }
    }

    //This function is run everytime the user wants to submit his or her answer
    //e is for event
    handleSubmit(e){
        //prevents the page from refreshing like how it normally does for a form
        e.preventDefault();

        let questions = this.state.questions;
        let curQ = this.state.currentQn;

        //If the user is at the last question of the session:
        if(curQ == questions.length){

            //Checking whether user is right or wrong and updating all the necessary state properties
            if(this.state.currentOpChosen == this.state.currentCorrectAns){
                if(this.state.correctans[questions[curQ - 1].category]){
                    this.state.correctans[questions[curQ - 1].category] = this.state.correctans[questions[curQ - 1].category] + 1
                }else{
                    this.state.correctans[questions[curQ - 1].category] = 1;
                }
                this.state.gotCorrect = "Correct! (✿◠‿◠)"
            }else{
                if(this.state.wrongans[questions[curQ - 1].category]){
                    this.state.wrongans[questions[curQ - 1].category] = this.state.wrongans[questions[curQ - 1].category] + 1
                }else{
                    this.state.wrongans[questions[curQ - 1].category] = 1
                }
                this.state.gotCorrect = "Wrong (∩︵∩), the correct answer was: \n" + decodeHtml(this.state.options[this.state.currentCorrectAns - 1])
            }

            //This chunk changes the strengths of the user based on right and wrongs of the current session
            //It then uploads this information to the database and updates the users strengths
            let strengths = this.state.strengths;
            for(let i in this.state.correctans){
                if(!(strengths[i] > 1)){
                    strengths[i] = strengths[i] + (0.1 * this.state.correctans[i])
                }
            }
            for(let i in this.state.wrongans){
                console.log(i, this.state.wrongans[i]);
                if(!(strengths[i] < 0)){
                    strengths[i] = strengths[i] - (0.1 * this.state.wrongans[i])
                }
            }
            let body = {
                strengths: strengths
            }
            console.log(strengths)
            axios.post("/user/updatestrengths/hrish",body)


            //Resetting all the state properties to begin a new session
            this.setState({
                questions: {},
                options: []
            })
            
            //Gathering questions for the next session
            this.componentDidMount()
            this.setState(prev => {
                return{
                    currentQn: 1,
                    currentOpChosen: -1,
                    correctans: {},
                    wrongans: {},
                    session: prev.session + 1
                }  
            })
        
            //If the user is not at the last question:
            //It does the exact same things without restarting the session and uploading information
            //It resets some state properties for the next question
        }else{
            if(this.state.currentOpChosen == this.state.currentCorrectAns){
                if(this.state.correctans[questions[curQ - 1].category]){
                    this.state.correctans[questions[curQ - 1].category] = this.state.correctans[questions[curQ - 1].category] + 1
                }else{
                    this.state.correctans[questions[curQ - 1].category] = 1;
                }
                this.state.gotCorrect = "Correct! (✿◠‿◠)"
            }else{
                if(this.state.wrongans[questions[curQ - 1].category]){
                    this.state.wrongans[questions[curQ - 1].category] = this.state.wrongans[questions[curQ - 1].category] + 1
                }else{
                    this.state.wrongans[questions[curQ - 1].category] = 1
                }
                this.state.gotCorrect = "Wrong (∩︵∩), the correct answer was: \n" + decodeHtml(this.state.options[this.state.currentCorrectAns - 1])
            }
            let options = []
            for(let op in questions[curQ].incorrect_answers){
                options.push(questions[curQ].incorrect_answers[op])
            }
            let topic = questions[curQ].category
            options.push(questions[curQ].correct_answer)
            options = shuffle(options);
            let corAns = options.indexOf(questions[curQ].correct_answer);
            this.setState(prev => {
                return {
                    currentQn: prev.currentQn + 1,
                    options: options,
                    currentOpChosen: -1,
                    currentCorrectAns: corAns + 1,
                    currQtopic: topic
                }
            })
        }

    }
    
    //This function handles when the user clicks another option and changes the state property: currentOpChosen
    handleChange(e){
        let {value} = e.target
        this.setState({
            currentOpChosen: value
        })
    }

    //This function keeps track of whether the user wants skill or topic based questions based on which button they clicked
    changeTopic(e){
        this.setState({
            Qtype: e.target.value
        })
    }

    /* A quick rundown of what I'm displaying (Reading the code below will also give a better picture)
        - A bunch of heading with their respective styling
        - A form element to keep track of which option the user has chosen
        - 2 button elements for the user to choose whether they want skill or topic based questions
    */

    render(){
        return(
            <div>
                <h1 style={{
                    position: "relative",
                    top: 30,
                    left: "-30%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 40
                }}>Question {this.state.currentQn}</h1>

                <h1 style={{
                    position: "relative",
                    top: 30,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 30
                }}>Topic: {this.state.currQtopic}</h1>

                <h1 style={{
                    position: "absolute",
                    top: 148,
                    left: "60%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 40
                }}>Session {this.state.session}</h1>

                <h2 style={{
                    position: "relative",
                    top: 30,
                    left: "13%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 30,
                    width: 1000
                }}>{this.state.questions[this.state.currentQn-1] ? decodeHtml(this.state.questions[this.state.currentQn - 1].question) : "Loading..."}</h2>

                <h3 style={{
                    position: "absolute",
                    top: 400,
                    left: "60%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                    width: 300
                }}> {this.state.gotCorrect}</h3>

                <form onSubmit={this.handleSubmit} style={{
                    position: "relative",
                    top: 30,
                    left: "13%",
                    color:"white",
                    fontSize: 30
                }}>
                <input
                type="radio" 
                value="1"
                style={{
                }}
                checked={this.state.currentOpChosen == -1 ? false : this.state.currentOpChosen == 1}
                onChange={this.handleChange}
                /> {this.state.options != 0 ? decodeHtml(this.state.options[0]) : "Loading..."}

                <br/><br/>

                <input
                type="radio"  
                value="2" 
                style={{
                    color:"black"
                }}
                checked={this.state.currentOpChosen == -1 ? false : this.state.currentOpChosen == 2}
                onChange={this.handleChange}
                /> {this.state.options.length != 0 ? decodeHtml(this.state.options[1]) : "Loading..."}

                <br/><br/>

                <input
                type="radio" 
                value="3" 
                style={{
                    color:"black"
                }}
                checked={this.state.currentOpChosen == -1 ? false : this.state.currentOpChosen == 3}
                onChange={this.handleChange}
                /> {this.state.options != 0 ? decodeHtml(this.state.options[2]) : "Loading"}

                <br/><br/>

                <input
                type="radio" 
                value="4" 
                style={{
                    color:"black"
                }}
                checked={this.state.currentOpChosen == -1 ? false : this.state.currentOpChosen == 4}
                onChange={this.handleChange}
                /> {this.state.options != 0 ? decodeHtml(this.state.options[3]) : "Loading"}

                <br/><br/>

                    <input style={{
                        position: "relative",
                        top: 30,
                        left: "10%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 20
                    }} type="submit" value={this.state.currentQn == this.state.questions.length ? "Replay?" : "Check?"}/>
                </form>

                <div style={{
                    position: "relative",
                    top: 50,
                    left: "20%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                }}>
                <button style={{
                    position: "relative",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                    width: 200}}
                    onClick={this.changeTopic}
                    value="topic"
                > Topic Based</button>
                <button style={{
                    position: "relative",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                    width: 200,
                    float: "left"}}
                    onClick={this.changeTopic}
                    value="skill"
                    > Skillbased</button>
                </div>

            </div>
        )

    }
}


//The functions below are utility functions to make computations and algorithms easier to access
//Each function used was either created by me or taken from an external source, if this is the case I've cited it in the Crit C document
//This function takes an array and shuffles it. 
//It is used for the options so that the correct answers is not always in the same spot everytime
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

//Some text that I gathered from the trivia database are encoded due to the special characters they use
//This function takes this text and decodes it to text that can be displayed in html
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

//If the user happens to want skillbased question and not topical,
//then we need to use their strengths property to decide what category questions to put in the next session
//This function takes a javascript object that holds all the elements of an array and a weightage of their probability of getting chosen
//it then gives back an element of this object based on that probability
function get(input) {
    var array = []; 
    for(var item in input) {
        if ( input.hasOwnProperty(item) ) { 
            for( var i=0; i<input[item]; i++ ) {
                array.push(item);
            }
        }
    }
    return array[Math.floor(Math.random() * array.length)];
}


export default Game