import axios from "axios";

//export const apiUrl = "http://callie-api2-dev.us-east-1.elasticbeanstalk.com";
export const apiUrl = "http://localhost:3001";

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

      axios.get(apiUrl + "/snippets").then(response => window.__RAILS_DATA__.snippets = response.data)
      axios.get(apiUrl + "/references").then(response => window.__RAILS_DATA__.references = response.data)
      axios.get(apiUrl + "/entities").then(response => window.__RAILS_DATA__.entities = response.data)
      axios.get(apiUrl + "/calls").then(response => window.__RAILS_DATA__.calls = response.data)
    });
   
  }
};
