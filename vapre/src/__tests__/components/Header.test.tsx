import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Header from "../../components/Header";

test("Renders Header", async () => {
  render(<Header />);

  expect(screen.getByText("VAPRE")).toBeInTheDocument();
});
