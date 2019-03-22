  var cl = console.log

  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyCsAwQS3GTYW5zELjt6o1DMnkR3XvTLgSY",
      authDomain: "train-timetableonix.firebaseapp.com",
      databaseURL: "https://train-timetableonix.firebaseio.com",
      projectId: "train-timetableonix",
      storageBucket: "train-timetableonix.appspot.com",
      messagingSenderId: "1047492980291"
  };
  firebase.initializeApp(config);

  var trainInfo = firebase.database();

  $("#create-trainLine-bttn").on("click", function () {

      // User input
      var trainName = $("#lineName-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var departureTime = $("#departureTime-input").val().trim();
      var trainFreq = $("#frequency-input").val().trim();

      var newTrainInput = {

          name: trainName,
          destination: trainDestination,
          trainDeparture: departureTime,
          frequency: trainFreq
      };

      // Upload new input data to the firebase
      trainInfo.ref().push(newTrainInput);

      cl(newTrainInput.name);
      cl(newTrainInput.destination);
      cl(newTrainInput.trainDeparture);
      cl(newTrainInput.frequency);

      alert("My lord, your train has been added.");

      $("#lineName-input").val("");
      $("#destination-input").val("");
      $("#departureTime-input").val("");
      $("#frequency-input").val("");

    return false;
  });

  trainInfo.ref().on("child_added", function (childSnapshot, prevChildKey) {
      cl(childSnapshot.val());

      var storeLineName = childSnapshot.val().name;
      var storeTrainDest = childSnapshot.val().destination;
      var storeDepartureTime = childSnapshot.val().trainDeparture;
      var storeTrainFreq = childSnapshot.val().frequency;

      var arrivalTime = storeDepartureTime.split(":");
      var trainTime = moment().hours(arrivalTime[0]).minutes(arrivalTime[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMin;
      var tArr;

      if (maxMoment === trainTime) {
      tArr = trainTime.format("hh:mm A");
      tMin = trainTime.diff(moment(), "minutes");
      } else {
          var timeDiff = moment().diff(trainTime, "minutes");
          var minRemaining = timeDiff % storeTrainFreq;
          tMin = storeTrainFreq - minRemaining;

          tArr = moment().add(tMin, "m").format("hh:mm A");
      }

      cl("tMin:", tMin);
      cl("tArr:", tArr);

      $("#train-info-table > tbody").append("<tr><td>" + storeLineName + "</td><td>" + storeTrainDest + "</td><td>" +
      storeTrainFreq + "</td><td>" + tArr + "</td><td>" + tMin + "</td></tr>");
  });