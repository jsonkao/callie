import axios from "axios";

//const apiUrl = "http://callie-api2-dev.us-east-1.elasticbeanstalk.com";
const apiUrl = "http://localhost:3001";

export const continuousAudioStream = () => {
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
      
// TODO: check if item in db, then PUT mention++
// TODO: transcripts should be array of all transcripts?
      axios
        .post(
          apiUrl + "/snippets",
          { transcript: snippet, call_id: 1 },
        )
        .then(response => {
          const snippet = response.data;
          const document = {            
            content: snippet.transcript,
            type: "PLAIN_TEXT"
          };
          return axios.post("https://language.googleapis.com/v1/documents:analyzeEntities?key=AIzaSyBcSS7wkzf-xhWzIG8Il1YlDCwI_oxj5Xw", {document,"encodingType": "UTF8"});
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
              );            
          });
          return axios.all(entities);
        })
        .catch(err => {
          console.log('ERROR', err);
        });
    });
  }
};
