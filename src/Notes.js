import React from "react";
import Insight from "./Insight";
import injectSheet from "react-jss";

const styles = {
  Notes: {
    position: "absolute",
    right: 0
  }
};
const Notes = ({ snippets, classes }) =>
  <div className={classes.Notes}>
    {snippets.map(snippet =>
      <div>
        <Insight insight={snippet.insights} />
        {snippet.transcript}
      </div>
    )}
  </div>;

export default injectSheet(styles)(Notes);
