import React from "react";
import { render } from "react-dom";
import Notes from "./Notes";
import { postSnippet } from "./annyang";

postSnippet();

class App extends React.Component {
  render() {
    const snippets = [
      {
        insights: ["George Bush"],
        transcript: "George Bush was a hint of the inanity to come from a Republican white house"
      },
      {
        insights: ["Sting"],
        transcript: "Sting is an okay artist"
      },
      {
        insights: ["Pink Floyd"],
        transcript: "Pink Floyd is probably one of the most beloved bands"
      },
      {
        insights: ["George Washington"],
        transcript: "George Washington died of bleeding"
      }
    ]
    return <Notes snippets={snippets}/>
  }
}

render(<App />, document.getElementById("app"));
