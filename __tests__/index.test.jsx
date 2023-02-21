// __tests__/index.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";

describe("Home Page", () => {
  it("renders a heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: "User Post Viewer",
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render users after fetching", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole("user-button")).not.toHaveLength(0);
    });
  });

  it("should set active user and display posts when a user is clicked", async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.queryAllByRole("user-button")).not.toHaveLength(0);
    });
    const userButton = await screen.findByRole("user-button", {
      name: "Leanne",
    });
    userButton.click();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Leanne's posts" })
      ).toBeInTheDocument();
      expect(screen.getAllByText(/sunt aut facere/i)).toHaveLength(3);
    });
  });

  it("should display all posts when load all button is clicked", async () => {
    render(<Home />);
    const userButton = await screen.findByRole("user-button", {
      name: "Leanne",
    });
    userButton.click();
    const loadAllButton = await screen.findByRole("button", {
      name: "Load all",
    });
    loadAllButton.click();
    await waitFor(() => {
      expect(screen.getAllByText(/sunt aut facere/i)).toHaveLength(10);
    });
  });
});
