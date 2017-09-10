import React from "react";
import { render } from "react-dom";
import Notes from "./Notes";
import { continuousAudioStream } from "./annyang";

continuousAudioStream();

window.__RAILS_DATA__ = {
  snippets: [
    {
      insights: ["George Bush"],
      mentions: 20,
      transcript:
        "George Bush was a hint of the inanity to come from a Republican white house"
    },
    {
      insights: ["Sting"],
      mentions: 30,
      transcript: "Sting is an okay artist"
    },
    {
      insights: ["Pink Floyd"],
      mentions: 14,
      transcript: "Pink Floyd is probably one of the most beloved bands"
    },
    {
      insights: ["George Washington"],
      mentions: 23,
      transcript: "George Washington died of bleeding"
    }
  ]
};
const App = ({ railsData }) => <Notes snippets={railsData.snippets} />;

render(
  <App railsData={window.__RAILS_DATA__} />,
  document.getElementById("app")
);
