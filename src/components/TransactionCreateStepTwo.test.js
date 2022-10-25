import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionCreateStepTwo from "./TransactionCreateStepTwo";

test("on initial render, the pay button is disabled", async () => {
  render(<TransactionCreateStepTwo sender={{ id: "5" }} receiver={{ id: "5" }} />);

  // expect(screen.getByRole("button", { name: /pay/i })).toBeDisabled();
  expect(await screen.findByRole("button", { name: /pay/i })).toBeDisabled();
});

test("if an amount and note is entered, the pay button becomes enabled", async () => {
  render(<TransactionCreateStepTwo sender={{ id: "5" }} receiver={{ id: "5" }} />);

  // https://testing-library.com/docs/queries/about#priority
  // 1 - getByRole, 2 - getByLabelText, 3 - getByPlaceholderText, ...

  const amountInput = screen.getByPlaceholderText(/amount/i);
  userEvent.type(amountInput, "50");
  const noteInput = screen.getByPlaceholderText(/add a note/i);
  userEvent.type(noteInput, "dinner");

  expect(await screen.findByRole("button", { name: /pay/i })).toBeEnabled();
});
