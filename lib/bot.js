var Botkit = require('botkit');

require('dotenv').config();

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

exports.controller = Botkit.slackbot({
  debug: process.env.debug,
  json_file_store: process.env.json_file_store || null
});

exports.bot = exports.controller.spawn({
  token: process.env.token
}).startRTM();
