const { Given, When, Then } = require('@cucumber/cucumber');
const { render, screen } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const { MemoryRouter } = require('react-router-dom');
const App = require('../../src/App').default;

Given('I am on the home screen', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
});

When('I navigate to the client list', async () => {
  const user = userEvent.setup();
  const clientLink = await screen.findByText('Go to Clients');
  await user.click(clientLink);
});

Then('I should see a table of clients', async () => {
  const clientTable = await screen.findByRole('table');
  expect(clientTable).toBeInTheDocument();
});