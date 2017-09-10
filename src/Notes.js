import React from "react";
import Insight from "./Insight";

const Notes = ({ insights }) =>
  <div>
    {insights.map(insight => <Insight insight={insight} />)}
  </div>;

export default Notes;
