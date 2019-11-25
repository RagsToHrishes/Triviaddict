import React from 'react';
import './App.css';

//Importing the Home component to display as the first thing when someone enters my website
import Home from "./components/Home/Home"


//Displaying the Home component
function App() {
  return (
      <div>
      <Home />
      </div>
  );
}

//Making this component usable from the html in the public folder
export default App;
