import React from "react";
import { render } from "react-dom";
import Notes from "./Notes";

class App extends React.Component {
  render() {
    const insights = [
      "George Bush",
      "Sting",
      "Pink Floyd",
      "George Washington"
    ]
    return <Notes insights={insights}/>
  }
}

render(<App />, document.getElementById("app"));
