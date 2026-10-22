// shopping-cart.js - add items to a shopping list and keep the item count up to date

var elItemName = document.getElementById('item-name');
var elAddItem = document.getElementById('add-item');
var elList = document.getElementById('shopping-list');
var elCount = document.getElementById('item-count');
var elGroup = document.getElementById('item-group');
var elFeedback = document.getElementById('item-feedback');

// Update the badge with the number of items currently in the list
function updateCount() {
	elCount.textContent = elList.getElementsByTagName('li').length;
}

// Add the item the user typed, but only if the text is not null or empty
function addItem() {
	var itemText = elItemName.value;

	elGroup.classList.remove('has-error');

	if (itemText === null || itemText.trim() === '') {        // nothing entered: show an error
		elGroup.classList.add('has-error');
		elFeedback.textContent = 'Please enter an item name.';
		elItemName.focus();
		return;
	}

	var newEl = document.createElement('li');                  // create the new list item
	newEl.className = 'list-group-item';
	newEl.appendChild(document.createTextNode(itemText.trim()));
	elList.appendChild(newEl);

	updateCount();
	elFeedback.textContent = 'Click an item in the list to remove it.';
	elItemName.value = '';
	elItemName.focus();
}

// Extra credit: clicking an item removes it and decrements the counter
function removeItem(e) {
	var target = e.target;
	if (target.tagName === 'LI') {
		elList.removeChild(target);
		updateCount();
	}
}

elAddItem.addEventListener('click', addItem, false);
elItemName.addEventListener('keydown', function (e) {           // pressing Enter also adds the item
	if (e.key === 'Enter') {
		addItem();
	}
}, false);
elList.addEventListener('click', removeItem, false);
