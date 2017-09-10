'use strict';

var Video = require('twilio-video');

const axios = require("axios");
const annyang = require("annyang");
  const apiUrl = "http://localhost:3001";
var activeRoom;
var previewTracks;
var identity;
var roomName;


// Attach the Tracks to the DOM.
function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    container.appendChild(track.attach());
  });
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
  var tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
function detachTracks(tracks) {
  tracks.forEach(function(track) {
    track.detach().forEach(function(detachedElement) {
      detachedElement.remove();
    });
  });
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);

// Obtain a token from the server in order to connect to the Room.
$.getJSON('/token', function(data) {
  identity = data.identity;
  document.getElementById('room-controls').style.display = 'block';
  document.getElementById('identifier').innerHTML = identity;
  // Bind button to join Room.
  document.getElementById('button-join').onclick = function() {
    roomName = document.getElementById('room-name').value;
    if (!roomName) {
      alert('Please enter a room name.');
      return;
    }

    log("Joining room '" + roomName + "'...");
    var connectOptions = {
      name: roomName,
      logLevel: 'debug'
    };

    if (previewTracks) {
      connectOptions.tracks = previewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(data.token, connectOptions).then(roomJoined, function(error) {
      log('Could not connect to Twilio: ' + error.message);
    });
  };

  // Bind button to leave Room.
  document.getElementById('button-leave').onclick = function() {
    log('Leaving room...');
    activeRoom.disconnect();
  };
});

// Successfully connected!
function roomJoined(room) {
  window.room = activeRoom = room;

  log("Joined as '" + identity + "'");
  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';

  // Attach LocalParticipant's Tracks, if not already attached.
  var previewContainer = document.getElementById('local-media');
  document.getElementById('button-preview').style.display = 'none';
  if (!previewContainer.querySelector('video')) {
    attachParticipantTracks(room.localParticipant, previewContainer);
  }

  // Attach the Tracks of the Room's Participants.
  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    var previewContainer = document.getElementById('remote-media');
    attachParticipantTracks(participant, previewContainer);
  });

  // When a Participant joins the Room, log the event.
  room.on('participantConnected', function(participant) {
    log("Joining: '" + participant.identity + "'");
  });

  // When a Participant adds a Track, attach it to the DOM.
  room.on('trackAdded', function(track, participant) {
    log(participant.identity + " added track: " + track.kind);
    var previewContainer = document.getElementById('remote-media');
    attachTracks([track], previewContainer);
  });

  // When a Participant removes a Track, detach it from the DOM.
  room.on('trackRemoved', function(track, participant) {
    log(participant.identity + " removed track: " + track.kind);
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on('participantDisconnected', function(participant) {
    log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  // Once the LocalParticipant leaves the room, detach the Tracks
  // of all Participants, including that of the LocalParticipant.
  room.on('disconnected', function() {
    log('Left');
    if (previewTracks) {
      previewTracks.forEach(function(track) {
        track.stop();
      });
    }
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    document.getElementById('button-join').style.display = 'inline';
    document.getElementById('button-leave').style.display = 'none';
  });
}

function openPreview() {
  var localTracksPromise = previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks();
    document.getElementById('button-preview').style.display = 'none';
  localTracksPromise.then(function(tracks) {
    window.previewTracks = previewTracks = tracks;
    var previewContainer = document.getElementById('local-media');
    if (!previewContainer.querySelector('video')) {
      attachTracks(tracks, previewContainer);
    }
  }, function(error) {
    console.error('Unable to access local media', error);
    log('Unable to access Camera and Microphone');
  });
}

document.getElementById('button-preview').onclick = function() {
  openPreview();
};

// Activity log.
function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Leave Room.
function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}
  console.log(3);
  if (annyang) {
    // Let's define a command.
    let commands = {
      hello: function() {
        console.log("Hello world!");
      }
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start({ autoRestart: true, continuous: false });
    annyang.addCallback("result", function(phrases) {
      const snippet = phrases[0];

      axios
        .post(
          apiUrl + "/snippets",
          { transcript: snippet, call_id: 1, participant: document.getElementById('identifier').innerHTML },
        )
        .then(response => {
          const snippet = response.data;
          const document = {            
            content: snippet.transcript,
            type: "PLAIN_TEXT"
          };
          return axios
            .post("https://language.googleapis.com/v1/documents:analyzeEntities?key=AIzaSyBcSS7wkzf-xhWzIG8Il1YlDCwI_oxj5Xw", {document,"encodingType": "UTF8"});
        })
        .then(response => {
          let { entities } = response.data;
          console.log("Entities:");
          entities = entities.map(entity => {
            console.log(entity.name);
            if (entity.metadata && entity.metadata.wikipedia_url) {
              console.log(
                ` - Wikipedia URL: ${entity.metadata.wikipedia_url}`
              );
            }
            return axios
              .post(
                apiUrl + "/entities",
                { wikipedia_link: entity.metadata ? entity.metadata.wikipedia_url : null, name: entity.name }
              )
              .then(response => {
                const entity = response.data;
                return axios.post(apiUrl+"/references",{entity_id:entity.id, snippet_id: snippet.id});
              });
          });
          return axios.all(entities);
        })
        .catch(err => {
          console.log('ERROR', err);
        });

        axios.all([axios.get(apiUrl+"/snippets"), axios.get(apiUrl+"/entities")])
          .then(axios.spread(function (snnips, ennts) {
            const snips = snnips.data;
            const ents = ennts.data
            console.log(snips);
            var snip = snips[snips.length - 1];
//            let text = snip.transcript;
let text="";
            const good = ents.filter(e => snip.transcript.includes(e.name));
            good.forEach(g => {
              text += "<i>" + g.name + "</i>, ";
            });
            document.getElementById("insight").innerHTML += '<b>' + snip.participant+'</b>'+'<p>'+text+"</p>";
//            document.getElementById("insight").innerHTML += '<b>' + snip.participant+'</b>'+'<p>'+text+"</p>";
        }));
    });
  }