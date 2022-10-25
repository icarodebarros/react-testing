import { v4 as uuidv4 } from "uuid";

describe("payment", () => {
  it("user can make payment", () => {
    /* 1 - login */
    cy.visit("/");
    // Using the 'Testing Playground' browser plugin: screen.getByRole("textbox", { name: /username/i })
    cy.findByRole("textbox", { name: /username/i }).type("johndoe");
    // Using the 'Testing Playground' browser plugin: screen.getByLabelText(/password/i)
    cy.findByLabelText(/password/i).type("s3cret");

    cy.findByRole("checkbox", { name: /remember me/i }).check();
    cy.findByRole("button", { name: /sign in/i }).click();

    /* 2 - check account balance */
    let oldBalance;
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => (oldBalance = $balance.text()));

    /* 3 - click on new button */
    cy.findByRole("button", { name: /new/i }).click();

    /* 4 - search for user and choose */
    cy.findByRole("textbox").type("devon becker");
    cy.findByText(/devon becker/i).click();

    /* 5 - add amount and note and click pay */
    const paymentAmount = "5.00";
    cy.findByPlaceholderText(/amount/i).type(paymentAmount);
    const uniqueNote = uuidv4();
    cy.findByPlaceholderText(/add a note/i).type(uniqueNote);
    cy.findByRole("button", { name: /pay/i }).click();

    /* 6 - return to transactions */
    cy.findByRole("button", { name: /return to transactions/i }).click();

    /* 7 - go to personal payments */
    cy.findByRole("tab", { name: /mine/i }).click();

    /* 8 - click on payment */
    cy.findByText(uniqueNote).click({ force: true });

    /* 9 - verify if payment was made */
    cy.findByText(`-$${paymentAmount}`).should("be.visible"); // <<< assertion
    cy.findByText(uniqueNote).should("be.visible"); // <<< assertion

    /* 10 - verify if payment amount was deducted */
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
      const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
      expect(convertedOldBalance - convertedNewBalance).to.equal(parseFloat(paymentAmount));
    });
  });
});
