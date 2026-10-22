// contact.js - wizard style contact form validated with DOM Level 2 event listeners

var elForm = document.getElementById('contact-form');
var elFirstName = document.getElementById('first-name');
var elLastName = document.getElementById('last-name');
var elEmail = document.getElementById('email');
var elPhone = document.getElementById('phone');
var elUsername = document.getElementById('username');
var elPassword = document.getElementById('password');
var elComments = document.getElementById('comments');
var elNextBtn = document.getElementById('next-btn');
var elResetBtn = document.getElementById('reset-btn');
var elStatus = document.getElementById('wizard-status');
var elProgress = document.getElementById('wizard-progress');
var elSuccess = document.getElementById('form-success');

// Email regex from class
var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var nameRegex = /^[A-Za-z][A-Za-z'-]+$/;   // starts with a letter, then letters, hyphens or apostrophes (2+ total)
var phoneRegex = /^[0-9]{10}$/;            // exactly 10 digits, nothing else

// Shows the Bootstrap 3 success/error state and status message for an input
function showStatus(elInput, isValid, message) {
	var elGroup = document.getElementById(elInput.id + '-group');
	var elIcon = elGroup.querySelector('.form-control-feedback');
	var elFeedback = document.getElementById(elInput.id + '-feedback');

	elGroup.classList.remove('has-error', 'has-success');
	elIcon.classList.remove('glyphicon-ok', 'glyphicon-remove');

	if (isValid) {
		elGroup.classList.add('has-success');
		elIcon.classList.add('glyphicon-ok');
	} else {
		elGroup.classList.add('has-error');
		elIcon.classList.add('glyphicon-remove');
	}
	elFeedback.textContent = message;
	return isValid;
}

// First and last name share this function
function validateName(elInput, label) {
	var value = elInput.value.trim();

	if (value === '') {
		return showStatus(elInput, false, label + ' cannot be empty.');
	} else if (value.length < 2) {
		return showStatus(elInput, false, label + ' must be at least 2 characters.');
	} else if (!nameRegex.test(value)) {
		return showStatus(elInput, false, label + ' can only contain letters, hyphens and apostrophes.');
	}
	return showStatus(elInput, true, label + ' looks good!');
}

function validateEmail(elInput) {
	var value = elInput.value.trim();

	if (value === '') {
		return showStatus(elInput, false, 'Email cannot be empty.');
	} else if (!validRegex.test(value)) {
		return showStatus(elInput, false, 'Please enter a valid email address (e.g. name@example.com).');
	}
	return showStatus(elInput, true, 'Email looks good!');
}

function validatePhone(elInput) {
	var value = elInput.value.trim();

	if (value === '') {
		return showStatus(elInput, false, 'Phone number cannot be empty.');
	} else if (!phoneRegex.test(value)) {
		return showStatus(elInput, false, 'Phone number must be exactly 10 digits with no hyphens, parentheses or spaces.');
	}
	return showStatus(elInput, true, 'Phone number looks good!');
}

// Username and password share this function
function validateLength(elInput, label, minLength) {
	var length = elInput.value.length;

	if (length === 0) {
		return showStatus(elInput, false, label + ' cannot be empty.');
	} else if (length < minLength) {
		return showStatus(elInput, false, label + ' must be at least ' + minLength + ' characters.');
	}
	return showStatus(elInput, true, label + ' looks good!');
}

function validateComments(elInput) {
	if (elInput.value.trim() === '') {
		return showStatus(elInput, false, 'Comments cannot be empty.');
	}
	return showStatus(elInput, true, 'Comments look good!');
}

// Wizard steps in order: each pairs an input with the check it needs
var steps = [
	{ input: elFirstName, validate: function () { return validateName(elFirstName, 'First name'); } },
	{ input: elLastName, validate: function () { return validateName(elLastName, 'Last name'); } },
	{ input: elEmail, validate: function () { return validateEmail(elEmail); } },
	{ input: elPhone, validate: function () { return validatePhone(elPhone); } },
	{ input: elUsername, validate: function () { return validateLength(elUsername, 'Username', 6); } },
	{ input: elPassword, validate: function () { return validateLength(elPassword, 'Password', 6); } },
	{ input: elComments, validate: function () { return validateComments(elComments); } }
];
var currentStep = 0;

function updateProgress() {
	var percent = Math.round(currentStep / steps.length * 100);

	elProgress.style.width = percent + '%';
	elProgress.setAttribute('aria-valuenow', percent);
	elStatus.textContent = currentStep < steps.length
		? 'Step ' + (currentStep + 1) + ' of ' + steps.length
		: 'All ' + steps.length + ' steps complete';
	elNextBtn.textContent = currentStep === steps.length - 1 ? 'Submit' : 'Next';
}

// Validates the current step; when valid, locks it and reveals the next one
function nextStep(e) {
	e.preventDefault();
	if (!steps[currentStep].validate()) {
		steps[currentStep].input.focus();
		return;
	}

	steps[currentStep].input.disabled = true;
	currentStep++;
	updateProgress();

	if (currentStep < steps.length) {
		var elNext = steps[currentStep].input;
		document.getElementById(elNext.id + '-group').classList.remove('hidden');
		elNext.focus();
	} else {
		elNextBtn.classList.add('hidden');
		elSuccess.classList.remove('hidden');
		elResetBtn.classList.remove('hidden');
	}
}

// Clears every step and starts the wizard again from the first name
function resetWizard() {
	elForm.reset();
	steps.forEach(function (step, i) {
		var elGroup = document.getElementById(step.input.id + '-group');
		var elIcon = elGroup.querySelector('.form-control-feedback');

		step.input.disabled = false;
		elGroup.classList.remove('has-error', 'has-success');
		elIcon.classList.remove('glyphicon-ok', 'glyphicon-remove');
		document.getElementById(step.input.id + '-feedback').textContent = step.hint;
		if (i > 0) {
			elGroup.classList.add('hidden');
		}
	});
	currentStep = 0;
	updateProgress();
	elSuccess.classList.add('hidden');
	elResetBtn.classList.add('hidden');
	elNextBtn.classList.remove('hidden');
	elFirstName.focus();
}

// DOM Level 2 event listeners
elForm.addEventListener('submit', nextStep, false);
elResetBtn.addEventListener('click', resetWizard, false);

// Show each field's status as soon as the user leaves it
steps.forEach(function (step) {
	step.hint = document.getElementById(step.input.id + '-feedback').textContent;   // remembered for Start Over
	step.input.addEventListener('blur', function () {
		if (step.input.value !== '') {
			step.validate();
		}
	}, false);
});

updateProgress();
