Feature: View Clients

  As a user,
  I want to be able to view a list of clients,
  so that I can see who is registered in the system.

  Scenario: The client list is displayed
    Given I am on the home screen
    When I navigate to the client list
    Then I should see a table of clients