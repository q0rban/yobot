var controller = require('./bot').controller;

function getAllKarma(message, callback) {
  controller.storage.teams.get(message.team, function(err, team_data) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
      if (typeof team_data === 'undefined') {
        team_data = {};
      }
      if (typeof team_data.karma === 'undefined') {
        team_data.karma = {};
      }
      callback(null, team_data.karma);
    }
  });
}

function setAllKarma(message, allKarma, callback) {
  if (typeof allKarma === "undefined") {
    allKarma = {};
  }
  controller.storage.teams.save({id: message.team, karma: allKarma}, function (err) {
    if (err) {
      callback(err);
    }
    else {
      callback();
    }
  });
}

function removeKarma(message, name, callback) {
  getAllKarma(message, function (err, allKarma) {
    if (err) {
      callback(err);
    }
    else {
      if (typeof allKarma[name] === "undefined" || !Number.isInteger(allKarma[name])) {
        allKarma[name] = 0;
      }
      allKarma[name]--;
      setAllKarma(message, allKarma, function (err) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, allKarma[name]);
        }
      });
    }
  });
}

function addKarma(message, name, callback) {
  getAllKarma(message, function (err, allKarma) {
    if (err) {
      callback(err);
    }
    else {
      if (typeof allKarma[name] === "undefined" || !Number.isInteger(allKarma[name])) {
        allKarma[name] = 0;
      }
      allKarma[name]++;
      setAllKarma(message, allKarma, function (err) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, allKarma[name]);
        }
      });
    }
  });
}

controller.hears(/([^+]+)\+{2,}$/, 'ambient', function(bot, message) {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'tada'
  }, function(err) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  var name = message.match[1];

  addKarma(message, name, function (err, karma) {
    if (!err) {
      bot.reply(message, name + ' has karma of ' + karma);
    }
  });
});

controller.hears(/([^\-]+)\-{2,}$/, 'ambient', function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'panda_face'
  }, function(err) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  var name = message.match[1];

  removeKarma(message, name, function (err, karma) {
    if (!err) {
      bot.reply(message, name + ' has karma of ' + karma);
    }
  });
});
