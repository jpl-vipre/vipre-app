import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Overview from "../../components/Overview";

test("Renders Overview", async () => {
  render(<Overview />);
});
