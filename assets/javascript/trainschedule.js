// Firebase Initialization
	var config = {
	    apiKey: "AIzaSyAaHjtg4mTrc-hfHsYGns98JOyAFunkv6o",
	    authDomain: "train-scheduler-197eb.firebaseapp.com",
	    databaseURL: "https://train-scheduler-197eb.firebaseio.com",
	    projectId: "train-scheduler-197eb",
	    storageBucket: "train-scheduler-197eb.appspot.com",
	    messagingSenderId: "147902963544"
	  };

	  firebase.initializeApp(config);

	var database = firebase.database();
// End Firebase Initialization

// Button that captures user info from the add train form:
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainFirst = $("#first-train-input").val().trim();
	var trainFrequency = $("#freq-input").val().trim();

// Variable that saves the info into a temporary object until it gets pushed into Firebase
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		firstTrain: trainFirst,
		frequency: trainFrequency
	};

// Pushes this new train info into the Firebase database
database.ref().push(newTrain);

// Alerts
alert("Train added!");

// Clears the forms
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#freq-input").val("");
});

// Creates a "snapshot" of the added train data to Firebase
database.ref().on("child_added", function(childSnapshot) {
	console.log(childSnapshot.val());

	// stores the data into variables
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainFirst = childSnapshot.val().firstTrain;
	var trainFrequency = childSnapshot.val().frequency;

	// Logs all of the information
	console.log(trainName);
	console.log(trainDestination);
	console.log(trainFirst);
	console.log(trainFrequency);

	// This is the math to get the next train arrival and the minutes until thet next train using moment
	var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
	var currentTime = moment();
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	var tRemainder = diffTime % trainFrequency;
	var tMinutesTilTrain = trainFrequency - tRemainder;
	var nextTrain = moment().add(tMinutesTilTrain, "minutes");
	var arrivalTime = moment(nextTrain).format("HH:mm");

	// Adds all of the train data into the table on the html side
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  	trainFrequency + "</td><td>" + arrivalTime + "</td><td>" + tMinutesTilTrain + "</td></tr>");

// Handles errors
}, function(errorObject) {

      console.log("Errors handled: " + errorObject.code);
});