$(document).ready(function () {

  //capitalizing title
  document.getElementById("title").style.textTransform = "uppercase";
  document.getElementById("subtitle").style.textTransform = "uppercase";

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEH49adeRRw31BCY6J0N2oftv5F24vESY",
    authDomain: "train-scheduler-c9520.firebaseapp.com",
    databaseURL: "https://train-scheduler-c9520.firebaseio.com",
    projectId: "train-scheduler-c9520",
    storageBucket: "train-scheduler-c9520.appspot.com",
    messagingSenderId: "428267025131",
    appId: "1:428267025131:web:6d4a64e9b2823bb0d004ae",
    measurementId: "G-01NK9P7H99"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $('.form-control').keyup(function() {
    $(this).val($(this).val().toUpperCase());
  });

  //Button for train on submit
  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTime = $("#time-input")
      .val()
      .trim();

    var frequency = $("#frequency-input")
      .val()
      .trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
    };



    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });

  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().firstTime;
    var frequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("LT"));

    // Create the new row
    var newRow = $("<tr id='train-table'>").append(
      $("<td id='trainName'>").text(trainName),
      $("<td id='destination'>").text(destination),
      $("<td id='firsttime'>").text(frequency),
      $("<td id='frequency'>").text(nextTrain.format("LT")),
      $("<td id='trainName'>").text(tMinutesTillTrain),
      
    );
    
    

    // Append the new row to the table
    $("#newTrainRow").append(newRow);
  });


});