import React from "react";
import Insight from "./Insight";

const InsightsSidebar = ({ insights }) =>
  <div>
    {insights.map(insight => <Insight insight={insight} />)}
  </div>;

export default InsightsSidebar;
