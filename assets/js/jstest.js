// jstest.js - output a greeting to the page
let today = new Date();
let hour = today.getHours();
let greeting;

if (hour < 12) {
	greeting = "Good morning";
} else if (hour < 18) {
	greeting = "Good afternoon";
} else {
	greeting = "Good evening";
}

document.getElementById("greeting").innerHTML = greeting + ", welcome to my JavaScript test page!";
