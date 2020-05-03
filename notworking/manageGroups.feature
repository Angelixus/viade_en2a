Feature: Manage groups of friends

	Scenario: Alice wants to create a group
		Given Alice has Bob and Claire as friends
		When Alice she selects them of them and writes as name group1
		Then the group is stored in her pod
		
	
	Scenario: Alice wants to delete a group
		Given Alice has a group named group1
		When Alice clicks on the delete button
		Then the group deleted from the pod


		
