import Language from "@google-cloud/language";

export const postSnippet = () => {
  if (annyang) {
    // Let's define a command.
    var commands = {
      'hello': function() { console.log('Hello world!'); }
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start({ autoRestart: true, continuous: false });
    annyang.addCallback('result', function(phrases) {
      const language = Language();
      const snippet = phrases[0];
      const document = {
        content: snippet,
        type: 'PLAIN_TEXT'
      };

      language.analyzeEntities({ document: document })
        .then((results) => {
          const entities = results[0].entities;

          console.log('Entities:');
          entities.forEach((entity) => {
            console.log(entity.name);
            console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
            if (entity.metadata && entity.metadata.wikipedia_url) {
              console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
            }
          });
        })
        .catch((err) => {
          console.error('ERROR:', err);
        });

    });
  }
};