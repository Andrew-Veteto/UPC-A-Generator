/* app.js */

let savedItems = [];
let IcantFindABetterWayToDoThis = "";

function updateDigitCount() {
	let input = document.getElementById("numberInput").value;
	let count = input.length;
	document.getElementById("digitCountMessage").innerText = `${count} digits entered.`;
	// Add a visual cue based on count if needed (e.g., change color)
	const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
	if (count === 11) {
		document.getElementById("digitCountMessage").style.color = "green";
	} else if (prefersDarkScheme.matches) {
		document.getElementById("digitCountMessage").style.color = "white";
	} else {
		document.getElementById("digitCountMessage").style.color = "#6c757d";
	}
	// Easiest way to prevent a user to mess up the UI
	// If a user was to generate a barcode then edit
	// the input field the UI to let them know would
	// render under the save screen. This is a simple
	// fix that won't allow the user to save a UPC
	// aslong as they don't change the input field
	// after its been verified
	hideSaveUPC();
}

function showMessage(message) {
	document.getElementById("messageText").innerText = message;
	document.getElementById("messageBox").style.display = "block";
	// Add a class to the body to dim the background (requires the CSS in the previous answer)
	document.body.classList.add('overlay-active');
}

function hideMessage() {
	document.getElementById("messageBox").style.display = "none";
	document.body.classList.remove('overlay-active');
}

function showSaveUPC() {
	document.getElementById("saveCode").style.display = "block";
}

function hideSaveUPC() {
	document.getElementById("saveCode").style.display = "none";
}

function showSaveName() {
	document.getElementById("saveName").style.display = "block";
	// Add overlay class for the name modal
	document.body.classList.add('overlay-active');
}

function hideSaveName() {
	document.getElementById("saveName").style.display = "none";
	document.body.classList.remove('overlay-active');
}

function cleanInput(input) {
	if (input.length == 4) {
		input = "0000000" + input;
	}
	if (input.length == 5) {
		input = "000000" + input;
	}
	if (input.length !== 11) {
		showMessage("Please enter **exactly 11 digits** for a UPC-A barcode. The 12th (check) digit will be automatically calculated for you.");
		return "bad";
	}
	return input;
}

function generateBarcode() {
	let input = document.getElementById("numberInput").value;
	input = cleanInput(input);
	if (input !== "bad") {
		// Generate the barcode using JsBarcode library
		JsBarcode("#barcodeDisplay", input, {
			format: "UPC",
			displayValue: true
		});
		// Ensure barcode display is visible after generation
		document.getElementById("barcodeDisplay").style.display = "block";
		showSaveUPC();
	}
}

function submitInfo() {
	let inputName = document.getElementById("nameInput").value;
	let inputNum = document.getElementById("numberInput").value;

	if (!inputName || !inputNum) {
		showMessage("Both name and UPC are required to save.");
		return;
	}

	for (let i = 0; i < localStorage.length; i++){
		const key = localStorage.key(i);
		const value = localStorage.getItem(key);
		if (inputName == key) {
			hideSaveName();
			showMessage("Name is already in use. Please use another name.");
			return;
		}
		if (inputNum == value) {
			hideSaveName();
			showMessage("UPC/PLU is already in use. Please use another UPC/PLU.");
			return;
		}
	}

	localStorage.setItem(inputName, inputNum);

	document.getElementById("nameInput").value = "";
	document.getElementById("numberInput").value = "";

	hideSaveUPC();
	hideSaveName();
	// Bring back main display elements after saving
	document.getElementById("barcodeDisplay").style.display = "block";
	document.getElementById("cardsWrapper").style.display = "block";
	makeCards();
}

function searchCards() {
	const seachQuery = document.getElementById("searchInput").value.toLowerCase();
	const filteredItems = savedItems.filter(item => {
		return item.name.toLowerCase().includes(seachQuery);
	});
	renderCards(filteredItems);
}

function deleteItem(item, upc) {
	document.body.classList.add('overlay-active');

	document.getElementById("confirmDelete").style.display = "block";
	const displayItemName = document.getElementById("nameForDeletion");
	displayItemName.textContent = item;
	const displayItemUpc = document.getElementById("upcForDeletion");
	displayItemUpc.textContent = upc;
	
	IcantFindABetterWayToDoThis = item;
}

function confirmDeleteItem() {
	localStorage.removeItem(IcantFindABetterWayToDoThis);
	hideDeleteItem();
	makeCards();
}

function hideDeleteItem() {
	document.getElementById("confirmDelete").style.display = "none";
	document.body.classList.remove('overlay-active');
}

function renderCards(itemsToRender) {
	const cardsContainer = document.getElementById("cardsArea");

	if (!cardsContainer) { return; }

	cardsContainer.innerHTML = ""; // Clear existing cards

	itemsToRender.forEach((item) => {

		// Changed class names to match the CSS provided in the previous answer
		const card = document.createElement("div");
		card.classList.add("barcode-card");

		const itemName = document.createElement("p");
		itemName.textContent = item.name;
		itemName.style.fontWeight = "bold";

		const itemUpc = document.createElement("p");
		itemUpc.textContent = item.upc;
		itemUpc.style.fontSize = "0.75rem";

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "×";
		deleteButton.classList.add("delete-btn");
		deleteButton.onclick = function () {
			deleteItem(item.name, item.upc);
			// After deletion, re-make cards which reloads the global list and re-renders
			makeCards();
		};

		const showCodeButton = document.createElement("button");
		showCodeButton.textContent = "Show Barcode";
		showCodeButton.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
		showCodeButton.onclick = function () {
			let input = cleanInput(item.upc);
			if (input !== "bad") {
				JsBarcode("#barcodeDisplay", input, {
					format: "UPC",
					displayValue: true
				});
				document.getElementById("barcodeDisplay").style.display = "block";
				hideSaveUPC();
			}
		};

		card.appendChild(itemName);
		card.appendChild(itemUpc);
		card.appendChild(showCodeButton);
		card.appendChild(deleteButton);

		cardsContainer.appendChild(card);
	});
}

function makeCards() {
	document.getElementById("cardsWrapper").style.display = "block";

	savedItems = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		const value = localStorage.getItem(key);
		savedItems.push({ name: key, upc: value });
	}

	// Call a new function to actually render the cards
	renderCards(savedItems);
}

document.addEventListener("DOMContentLoaded", (event) => {
	makeCards();
	// Initially hide the save button div until a barcode is generated
	hideSaveUPC();
	// Initially hide the main barcode display SVG if no barcode is present on load
	if (localStorage.length === 0) {
		document.getElementById("barcodeDisplay").style.display = "none";
	}
});