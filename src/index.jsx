import React from "react";
import { render } from "react-dom";
import Notes from "./Notes";
import { continuousAudioStream, apiUrl } from "./annyang";
import axios from "axios";

continuousAudioStream();

if (!window.__RAILS_DATA__) {
  window.__RAILS_DATA__ = {snippets:[],references:[],entities:[],calls:[]};
}

const App = ({ railsData }) => <Notes railsData={window.__RAILS_DATA__} entities={railsData.entities} references={railsData.references} snippets={railsData.snippets} />;

render(
  <App railsData={window.__RAILS_DATA__} />,
  document.getElementById("app")
);
