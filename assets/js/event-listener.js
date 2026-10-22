// event-listener.js - validate form inputs using event listeners with parameters

var elUsername = document.getElementById('username');
var elPassword = document.getElementById('password');

// Generic check: updates the group, input and feedback for whichever field triggered the event
function checkInput(elInput, groupId, feedbackId, label, minLength) {
	var elGroup = document.getElementById(groupId);
	var elFeedback = document.getElementById(feedbackId);
	var length = elInput.value.length;

	elGroup.classList.remove('has-error', 'has-success');   // back to default state

	if (length === 0) {                                      // default state
		elFeedback.textContent = label + ' must be at least ' + minLength + ' characters.';
	} else if (length < minLength) {                         // error state
		elGroup.classList.add('has-error');
		elFeedback.textContent = label + ' must be ' + minLength + ' characters or more.';
	} else {                                                 // success state
		elGroup.classList.add('has-success');
		elFeedback.textContent = label + ' looks good!';
	}
}

// Event listeners with parameters: an anonymous function passes arguments to checkInput
elUsername.addEventListener('blur', function () {
	checkInput(elUsername, 'username-group', 'username-feedback', 'Username', 5);
}, false);

elPassword.addEventListener('blur', function () {
	checkInput(elPassword, 'password-group', 'password-feedback', 'Password', 8);
}, false);
