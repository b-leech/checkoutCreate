const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);
const storedCountry = document.getElementById('country-code');
// let country = "GB";
let countrySettings = "NL";

// Used to retrieve country value from url
const urlCountryParams = new URLSearchParams(window.location.search);
const countryURL = urlCountryParams.get('country');
console.log(countryURL)

// global configuration variables
let openFirst = true
let billAdd = false
let onlyStored = true
let holderName = false
let showPayMethod = true
let hideCVC = false
let placeholderData = false

// identify checkout div and create new empty div to replace with
const oldDiv = document.getElementById("dropin-container");
const newDiv = document.createElement('div');


const flagUrlMap = {
	"NL": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg",
		"total": "€40.00",
		"currency": "EUR",
		"href": "{{ url_for('checkout', integration=method, country=NL) }}"
	},
	"GB": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg",
		"total": "£40.00",
		"currency": "GBP",
		"href": "{{ url_for('checkout', integration=method, country=GB) }}"
	},
	"US": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/us.svg",
		"total": "$40.00",
		"currency": "USD",
		"href": "{{ url_for('checkout', integration=method, country=US) }}"
	}
}

const testCardBrandsMap = {
	"visa": {
		"src": "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg",
		"cardNumber": "4111 1111 1111 1111",
		"expiry": "03/30",
		"cvc": "737"
	},
	"mc": {
		"src": "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg",
		"cardNumber": "2222 4107 4036 0010",
		"expiry": "03/30",
		"cvc": "737"
	},
	"amex": {
		"src": "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg",
		"cardNumber": "3700 0000 0000 002",
		"expiry": "03/30",
		"cvc": "7373"
	}
}


// Country dropdown changes the flag image and reloads the dropin with new country values
function changeSelect(el) {
	document.getElementById('flag_img').src = flagUrlMap[el.value].src;
	const country = el.value;
	countrySettings = getCountryData(country)
	console.log(countrySettings)
	if (document.getElementById("dropin-container") && document.getElementById("placeholderData").checked == true) {
		placeholderData = {
			holderName: "Jane Doe",
			billingAddress: {
				street: countrySettings.street,
				postalCode: countrySettings.postalCode,
				city: countrySettings.city,
				country: countrySettings.countryCode,
				stateOrProvince: countrySettings.stateOrProvince,
				houseNumberOrName: countrySettings.houseNumberOrName
			}
		}
		// document.getElementById("placeholderData").checked = false
		// placeholderData = false
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container");
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	} else if (document.getElementById("dropin-container")) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container");
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
}

// function openFirstPayment() {
// 	var firstPayBox = document.getElementById("firstPayBox")
// 	if (firstPayBox == true){
// 		openFirst = true
// 		oldDiv.replaceWith(newDiv)
// 		newDiv.setAttribute("id", "dropin-container")
// 		initCheckout()
// 	}
// 	else {
// 		openFirst = false
// 		oldDiv.replaceWith(newDiv)
// 		newDiv.setAttribute("id", "dropin-container")
// 		initCheckout()
// 	}
// }

// Funtion to toggle first payment method open
document.getElementById('firstPayBox').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		openFirst = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		openFirst = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Function to add billing address
document.getElementById('billAdd').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		billAdd = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		billAdd = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})


// Function to show only saved payment methods
document.getElementById('onlyStored').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		onlyStored = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		onlyStored = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// function to show holder name field
document.getElementById('holderName').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		holderName = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		holderName = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})


// Funtion to show all payment methods
document.getElementById('showPayMethod').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		showPayMethod = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		showPayMethod = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Funtion to hide or show cvc
document.getElementById('hideCVC').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		hideCVC = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		hideCVC = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Funtion for including placeholder data
document.getElementById('placeholderData').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		placeholderData = {
			holderName: "Jane Doe",
			billingAddress: {
				street: countrySettings.street,
				postalCode: countrySettings.postalCode,
				city: countrySettings.city,
				country: countrySettings.countryCode,
				stateOrProvince: countrySettings.stateOrProvince,
				houseNumberOrName: countrySettings.houseNumberOrName
			}
		}
		console.log(countrySettings)
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		placeholderData = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

const countryVariables = [
	{
		countryCode: "NL",
		currency: "EUR",
		locale: "en_NL",
		city: "Amsterdam",
		postalCode: "1011DJ",
		street: "Simon Carmiggeltstraat",
		houseNumberOrName: "6 - 50"
	},
	{
		countryCode: "GB",
		currency: "GBP",
		locale: "en_GB",
		city: "London",
		postalCode: "W1T3HE",
		street: "Wells Mews",
		houseNumberOrName: "12 13"
	},
	{
		countryCode: "US",
		currency: "USD",
		locale: "en_US",
		city: "New York City",
		postalCode: "10003",
		street: "71 5th Avenue",
		stateOrProvince: "NY",
		houseNumberOrName: "Floor 11"
	}
]
if (storedCountry) {
	const selectedCountry = JSON.parse(storedCountry.innerHTML);
	countrySettings = getCountryData(selectedCountry)
}
if (countryURL) {
	const selectedCountry = countryURL
	countrySettings = getCountryData(selectedCountry)
}

function getCountryData(countrySettings) {
	return countryVariables.find((locality) => locality.countryCode === countrySettings)
}

async function initCheckout() {
	try {
		const paymentMethodsResponse = await callServer("/api/getPaymentMethods", countrySettings);
		console.log(countrySettings)
		let prettyResponse = JSON.stringify(paymentMethodsResponse, null, 2)
		console.log(prettyResponse)
		console.log(openFirst);
		let configuration = {
			paymentMethodsResponse: paymentMethodsResponse,
			clientKey,
			locale: countrySettings.locale || "en_NL",
        	countryCode: countrySettings.countryCode || "NL",
			environment: "test",
			showPayButton: true,
			paymentMethodsConfiguration: {
				ideal: {
					showImage: true
				},
				card: {
					hasHolderName: holderName,
					holderNameRequired: true,
					hideCVC: hideCVC,
					// brands: ['mc','visa','amex'],
					name: "Credit or debit card",
					data: {
						holderName: placeholderData.holderName,
						billingAddress: placeholderData.billingAddress 
					},
					enableStoreDetails: true,
					billingAddressRequired: billAdd,
					amount: {
						value: 4000,
						currency: countrySettings.currency || "EUR"
					}
				},
				storedCard: {
					hideCVC: hideCVC
				},
				paypal: {
					amount: {
						currency: countrySettings.currency || "EUR",
						value: 4000
					},
					//commit: false,
					environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
					countryCode: countrySettings.countryCode || "NL", // Only needed for test. This will be automatically retrieved when you are in production.
					showPayButton: true,
					merchantId: "AD74FQNVXQY5E"
					//subtype: "redirect"
				}
			},
			onSubmit: (state, dropin) => {

				if (state.isValid) {
					handleSubmission(state, dropin, "/api/initiatePayment", countrySettings);
				}
			},
			onAdditionalDetails: (state, dropin) => {
				handleSubmission(state, dropin, "/api/submitAdditionalDetails");
			},
			onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
				// handleSubmission(state, dropin, "/api/disable");
			}

		};
		console.log(configuration)

		console.log(openFirst)

		const checkout = await AdyenCheckout(configuration);
		checkout.create('dropin', {
			showRemovePaymentMethodButton: true,
			openFirstPaymentMethod: openFirst,
			showStoredPaymentMethods: onlyStored,
			showPaymentMethods: showPayMethod,
			onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
				callServer("/api/disable", { "storedPaymentMethodId": storedPaymentMethodId });
				resolve()
				reject()
			}
		})
			.mount("#dropin-container");

	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}

/*function filterUnimplemented(pm) {
	pm.paymentMethods = pm.paymentMethods.filter((it) =>
		[
			"scheme",
			"ideal",
			"dotpay",
			"giropay",
			"sepadirectdebit",
			"directEbanking",
			"ach",
			"alipay",
			"klarna_paynow",
			"klarna",
			"klarna_account",
			"paypal",
			"boletobancario_santander"
		].includes(it.type)
	);
	return pm;
}*/


// Event handlers called when the shopper selects the pay button,
// or when additional information is required to complete the payment
async function handleSubmission(state, dropin, url, countrySettings) {
	try {
		//keeping the country data for the /payments call
		const mergedData = {
			...state.data,
			...countrySettings
		}
		const res = await callServer(url, mergedData);
		let prettyResponse = JSON.stringify(res, null, 2)
		console.log(prettyResponse)
		handleServerResponse(res, dropin);
	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}

// Calls your server endpoints
async function callServer(url, data) {
	const res = await fetch(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : "",
		headers: {
			"Content-Type": "application/json"
		}
	});
	return await res.json();
}

// Handles responses sent from your server to the client
function handleServerResponse(res, dropin) {
	if (res.action) {
		dropin.handleAction(res.action);
	} else {
		switch (res.resultCode) {
			case "Authorised":
				window.location.href = "/result/success";
				break;
			case "Pending":
			case "Received":
				window.location.href = "/result/pending";
				break;
			case "Refused":
				window.location.href = "/result/failed";
				break;
			default:
				window.location.href = "/result/error";
				break;
		}
	}
}

// Test cards JS
// function copyToClipboard() {
// 	// Get the text field
// 	let copyPAN = document.getElementById('cardNumber').textContent;
// 	console.log(copyPAN)

// 	// Select the text field
// 	// copyPAN.select();
// 	// copyPAN.setSelectionRange(0, 99999); // For mobile devices

// 	// Copy the text inside the text field
// 	navigator.clipboard.write(copyPAN);

// 	// Alert the copied text
// 	alert("Copied the text: " + copyPAN);
// }
let r = document.querySelector(':root');

// Colour picker changes button color
function setDynamicCSS() {
	colorVal = document.getElementById("buttonColorPick").value;
	r.style.setProperty('--background-color', colorVal);
}

function backgroundColor() {
	let bgVal = document.getElementById("bgColorPick").value;
	r.style.setProperty('--bg-color', bgVal);
}

function dropinColor() {
	let dropinColor = document.getElementById("dropinColorPick").value;
	r.style.setProperty('--dropin-color', dropinColor);
}

function dropinTabColor() {
	let dropinTabColor = document.getElementById("dropinTabColorPick").value;
	r.style.setProperty('--dropin-tab-color', dropinTabColor);
}

function textColor() {
	let textColor = document.getElementById("textColorPick").value;
	r.style.setProperty('--text-color', textColor);
}


function buttonEdges () {
	let edgeValue = document.getElementById('buttonEdges').value
	let pixelVal = edgeValue + 'px'
	r.style.setProperty('--button-edges', pixelVal);
}

function bodyEdges () {
	let bodyEdgeValue = document.getElementById('bodyEdges').value
	let bodyPixelVal = bodyEdgeValue + 'px'
	r.style.setProperty('--body-edges', bodyPixelVal);
	r.style.setProperty('--selectedBody-edges', bodyPixelVal);
	r.style.setProperty('--topedges-left', bodyPixelVal);
	r.style.setProperty('--topedges-right', bodyPixelVal);
	r.style.setProperty('--bottomedges-left', bodyPixelVal);
	r.style.setProperty('--bottomedges-right', bodyPixelVal);
}


// Funtion to remove borders
document.getElementById('noBorder').parentNode.addEventListener('click', function (event) {
	if (this.querySelector('input').checked) {
		r.style.setProperty('--border-off', "0")
		console.log(borderValue)
	}
	else {
		r.style.setProperty('--border-off', null)
	}
})

function resetDynamicCSS () {
	r.style.setProperty('--background-color', null);
	r.style.setProperty('--dropin-width', null);
	r.style.setProperty('--body-edges', null);
	r.style.setProperty('--selectedBody-edges', null);
	r.style.setProperty('--topedges-left', null);
	r.style.setProperty('--topedges-right', null);
	r.style.setProperty('--bottomedges-left', null);
	r.style.setProperty('--bottomedges-right', null);
	r.style.setProperty('--button-edges', null);
	r.style.setProperty('--bg-color', null);
	r.style.setProperty('--dropin-color', null);
	r.style.setProperty('--dropin-tab-color', null);
	r.style.setProperty('--dropin-font', null)
	r.style.setProperty('--text-color', null);
	r.style.setProperty('--text-bold', null);
	r.style.setProperty('--text-italic', null);
	r.style.setProperty('--text-align', null);
	r.style.setProperty('--payButton-width', null);
	r.style.setProperty('--payments-spacing', null);
	r.style.setProperty('--paymentselected-margin', null);
	r.style.setProperty('--font-options', null);
}

function dropinWidth () {
	let widthValue = document.getElementById("changeWidth").value
	let widthpx = widthValue + 'px'
	r.style.setProperty('--dropin-width', widthpx);
	console.log(widthpx)
}

function payButtonWidth () {
	let payWidthValue = document.getElementById("payButtonWidth").value
	let payWidthpx = payWidthValue + 'px'
	r.style.setProperty('--payButton-width', payWidthpx);
}

function paymentsSpacing () {
	let paymentSpacingValue = document.getElementById("paymentsSpacing").value
	let paymentSpacingpx = paymentSpacingValue + 'px'
	r.style.setProperty('--payments-spacing', paymentSpacingpx);
	r.style.setProperty('--paymentselected-margin', paymentSpacingpx);
	console.log(paymentSpacingpx)
}

function fontWidth () {
	let fontValue = document.getElementById("fontSize").value
	let fontpx = fontValue + 'px'
	r.style.setProperty('--dropin-font', fontpx);
}

// Copy to clipboard function
// function copyToClipboard(e) {
// 	const cb = navigator.clipboard;
// 	cb.writeText(e.target.innerText)
// }

function turnCard() {
	document.getElementById("card").classList.add('card-visited');
	// cardDiv.setAttribute("class", "card-visited")
}
 function resetCard() {
	if (document.getElementById("card").classList.contains('card-visited')) {
		document.getElementById("card").classList.remove('card-visited');
	}
 }

function changeTestCard(brandValue) {
	document.getElementById('brand_img').src = testCardBrandsMap[brandValue.value].src;
	document.getElementById('cardNumber').innerText = testCardBrandsMap[brandValue.value].cardNumber;
	document.getElementById('cvc').innerText = testCardBrandsMap[brandValue.value].cvc
}

function positionText() {
	let positionValue = document.getElementById("positionText").value
	r.style.setProperty('--text-align', positionValue);
	console.log(positionValue)
}

function makeBold() {

	if (document.getElementById("makeBold").classList.contains("bold-active")) {
		document.getElementById("makeBold").classList.remove("bold-active")
		r.style.setProperty('--text-bold', null)
		console.log("i'm checked")
	}
	else {
		document.getElementById("makeBold").classList.add("bold-active")
		r.style.setProperty('--text-bold', "bold")
		console.log("not checked")
	}
}

//makie text italic 
function makeItalic() {

	if (document.getElementById("makeItalic").classList.contains("italic-active")) {
		document.getElementById("makeItalic").classList.remove("italic-active")
		r.style.setProperty('--text-italic', null)
		console.log("i'm checked")
	}
	else {
		document.getElementById("makeItalic").classList.add("italic-active")
		r.style.setProperty('--text-italic', "italic")
		console.log("not checked")
	}
}
// document.getElementById('showPayMethod').parentNode.addEventListener('click', function (event); 
//drop down selector for the different font styles 
//document.getElementById("font_select").parentNode.addEventListener('change', function() {
 function changeFont() {
    r.style.setProperty('--font-options', null);
	let fontValue = document.getElementById("font_select").value


		r.style.setProperty('--font-options', fontValue);	

console.log(fontValue)
}
// document.getElementById('placeholderData').parentNode.addEventListener('click', function (event) {
//hiding payment methods functions
function showPaypal() {
	const element = document.querySelector('[aria-label="PayPal"]');
	console.log(element);
	// const paypalParent = document.getElementsByClassName('adyen-checkout__payment-method--paypal')

	const paypalState = document.getElementById('showPaypal').checked;
	console.log(paypalState);
	if (paypalState == true) {
		element.style.display = ""
	} else {
		element.style.display = "none"
	}
	// if (paypalState.classList.contains('checked')) {
	// 	console.log('checked')
	// } else {
	// 	console.log('not checked')
	// }

	// if (document.getElementById("makeItalic").classList.contains("italic-active")) {
	// 	document.getElementById("makeItalic").classList.remove("italic-active")
	// 	r.style.setProperty('--text-italic', null)
	// 	console.log("i'm checked")
	// }
	// else {
	// 	document.getElementById("makeItalic").classList.add("italic-active")
	// 	r.style.setProperty('--text-italic', "italic")
	// 	console.log("not checked")
	// }
}


initCheckout();



