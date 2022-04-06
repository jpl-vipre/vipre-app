import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Visualization from "../../../components/Visualizations/Visualization";

test("Renders Visualization", async () => {
  render(<Visualization config={{ type: "scatterplot", xAxis: "", yAxis: "", color: "" }} />);
});
