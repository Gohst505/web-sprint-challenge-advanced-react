import React from 'react';
import axios from 'axios'; 

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super();
    this.state ={
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
    passes: null
    }
  }
   positions = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3]
  ];
  

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    //tracking coordinates by returning the index of B at certain point in array
    return this.positions[this.state.index];
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    //Message from coordinate setup
    return `(${this.getXY()[0]}, ${this.getXY()[1]})` 
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      passes:null
    });
    document.getElementById('email').value=''
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    //takes input from button and moves coordinate
    if(direction === 'up' && this.state.index - 3 >= 0){
      return {index: this.state.index -3, steps: this.state.steps + 1, passes:null}
    }
    else if(direction === 'down' && this.state.index + 3 <= 8){
      return{index: this.state.index + 3, steps: this.state.steps + 1, passes:null}
    }
    else if(direction === 'left' && this.state.index - 1 >= 0 && this.state.index !=3 && this.state.index != 6){
      return {index: this.state.index -1, steps: this.state.steps + 1, passes:null}
    }
    else if(direction === 'right' && this.state.index + 1 <= 8 && this.state.index != 2 && this.state.index != 5){
      return {index: this.state.index + 1, steps: this.state.steps + 1, passes:null}
    }
    else{
      return{...this.state, passes:`You can't go ${direction}`}
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.setState({...this.state, ...this.getNextIndex(evt.target.id)});
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    //Changes email for inputs
    this.setState({...this.state, email:evt.target.value});
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = this.positions[this.state.index][0];
    const y = this.positions[this.state.index][1];
    const steps = this.state.steps;
    const email = this.state.email;
   

    axios
      .post("http://localhost:9000/api/result", {'x': x, 'y': y, 'steps':steps, 'email': email.trim()}) //May need additional Value
      .then((res) => {
        return this.setState({...this.state, passes:res.data.message})
      })
      .catch((err) => {return this.setState({...this.state, passes:err.response.data.message})})
      .finally(document.getElementById('email').value='')
  }

  render() {
    //Tying it all together
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates: {this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.passes}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
