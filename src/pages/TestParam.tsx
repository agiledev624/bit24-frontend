import React from "react";

export const TestParam = ({ match }) => (
  <div>Parameter is {match.params.testParam}</div>
);

export default TestParam;
