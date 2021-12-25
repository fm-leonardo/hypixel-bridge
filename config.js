module.exports = {
   bot: {
      prefix: 'mmm', // Used to be used for commands, now used to not send a message to Minecraft in guildChannel
      owner: 'leowonardo#2443', // Set this to your Discord username
   },

   ids: {
      owner: '247820535155785728', // Bot owner (to enable dev commands)
      testingServer: '559402502102056961', // Server to test slash commands in (registers in both prod and testing server by default)
      server: '923369720214876170', // Prod server (has guildChannel and trustedRole)
      guildChannel: '923385798953414736', // Server to send and receive Minecraft messages
      trustedRole: '923383956458598452', // Role to access certain restricted commands (currently only "say" command at the moment)
      moderatorRole: '923383674043514910', // Role used for access to moderator commands (currently only "slowmode" command at the moment)
   },

   messages: {
      errorDev: 'There was an error while trying to execute that command! Check the console log for more details.',
      errorUserFriendly: 'There was an error while trying to perform that task!',
      noPermissionNormal: 'You do not have the correct permissions to use this command.',
      noPermissionDev: "You shouldn't be using this command.",
      selfNoPermissions: 'Sorry, I do not have the correct permissions to perform that task.',
      footer: 'Bot by leowonardo#2443',
      statuses: [
         'Trans rights!'
      ],
   },

   colours: {
      error: '#E74C3C',
      success: '#3A783F',
      informational: '#3F51B5',
   },
};
