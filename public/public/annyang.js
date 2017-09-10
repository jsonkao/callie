import axios from "axios";

export const postSnippet = () => {
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
      const document = {
        content: snippet,
        type: "PLAIN_TEXT"
      };

      axios
        .post(
          "https://language.googleapis.com/v1/documents:analyzeEntities?key=AIzaSyBcSS7wkzf-xhWzIG8Il1YlDCwI_oxj5Xw",
          {
            encodingType: "UTF8",
            document: document
          }
        )
        .then(results => {
          const entities = results.data.entities;

          console.log("Entities:");
          entities.forEach(entity => {
            console.log(entity.name);
            console.log(
              ` - Type: ${entity.type}, Salience: ${entity.salience}`
            );
            if (entity.metadata && entity.metadata.wikipedia_url) {
              console.log(
                ` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`
              );
            }
          });
        })
        .catch(err => {
          console.error("ERROR:", err);
        });
    });
  }
};
