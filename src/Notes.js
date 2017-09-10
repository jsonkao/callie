import React from "react";
import Insight from "./Insight";
import injectSheet from "react-jss";

const styles = {
  Notes: {
  },
  snippet: {
    fontSize: 15,
    fontFamily: "Arial",
  }
};
const Notes = ({ entities, snippets, references, classes, railsData }) => {
  console.log(snippets);
  return (
    <div className={classes.Notes}>
      {entities.map(entity => {
        const mentions = references.filter(ref => ref.entity_id === entity.id).length;
        return (
          <div className={classes.snippet} key={entity.id}>
            <Insight mentions={mentions} insight={entity.name} />
            {references.map(ref => {
              if (ref.entity_id === entity.id) {
                return <p>{snippets.find(s => s.id === ref.snippet_id).transcript}</p>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}

export default injectSheet(styles)(Notes);
