import React, { useState } from "react";
import axios from "axios";
// Suggested initial states

  const initialMessage = "";
  const initialEmail = "";
  const initialSteps= 0;
  const initialIndex= 4; // the index the "B" is at
  const initialState = {message: initialMessage, email: initialEmail, steps: initialSteps, index:initialIndex, passes: null}

//const initialErrors = {
//  initialMessage: "",
 // initialEmail: "",
//};

const positions = [
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

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [coordinate, setCoordinate] = useState(initialState);
  //const [errors, setErrors] = useState(initialErrors);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return positions[coordinate.index];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `(${getXY()[0]}, ${getXY()[1]})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCoordinate({...initialState, message: initialMessage, email:initialEmail, passes:null});
    document.getElementById('email').value = '';
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'up' && coordinate.index - 3 >= 0){
      return {...coordinate,index:coordinate.index-3, steps:coordinate.steps + 1, passes: null }
    }
    else if(direction ==='down' && coordinate.index + 3 <= 8){ 
      return{...coordinate, index:coordinate.index + 3, steps:coordinate.steps + 1, passes: null}
    }
    else if(direction ==='left' && coordinate.index - 1 >= 0 && coordinate.index != 3 && coordinate.index != 6){
      return{...coordinate, index:coordinate.index - 1, steps: coordinate.steps + 1, passes: null}
    }
    else if(direction === 'right' && coordinate.index + 1 <= 8 && coordinate.index != 2 && coordinate.index !=5){
      return {...coordinate, index: coordinate.index + 1, steps: coordinate.steps + 1, passes:null}
    }
    else{
      return{...coordinate, passes:`You can't go ${direction}`}
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    setCoordinate(getNextIndex(evt.target.id))
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setCoordinate({...coordinate, email:evt.target.value})
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = getXY()[0];
    const y = getXY()[1];
    const steps = coordinate.steps;
    const email = coordinate.email;
    
    axios
      .post("http://localhost:9000/api/result", {'x': x, 'y': y, 'steps': steps, 'email': email}) //May need Values like in class app
      .then((res) => {
        return setCoordinate({...coordinate, passes:res.data.message})
      })
      .catch((err) => {return setCoordinate({...coordinate, passes:err.response.data.message})})
      .finally(document.getElementById('email').value='')
      
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXYMessage()}</h3>
        <h3 id="steps">You moved {coordinate.steps} {coordinate.steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === coordinate.index ? " active" : ""}`}>
            {idx === coordinate.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{coordinate.passes}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange}></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  );
}
