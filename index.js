const path = require('path');
const Commando = require('discord.js-commando');
const settings = require(path.join(__dirname, '/settings.json'));
require('dotenv/config');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer().listen(port);

const bot = new Commando.Client({
	commandPrefix: settings.PREFIX,
	disableEveryone: true,
	unknownCommandResponse: false
});

bot.registry.registerGroup('music', 'Music');
bot.registry.registerGroup('mal', 'MyAnimeList');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(path.join(__dirname, '/commands'));

global.servers = {}; /* global servers */
global.currentSong = {};

bot.on('guildMemberAdd', member => {
	member.send('Welcome to the server');
	const memberRole = member.guild.roles.find(channel => channel.name === 'The Collective');
	member.addRole(memberRole);
});

bot.on('ready', () => {
	console.log('Ready');
	bot.user.setActivity('with myself', { type: 'PLAYING' });
});

bot.on('guildCreate', guild => {
	guild.owner.send(`Thanks for adding the bot! You can type ${settings.PREFIX}help for a list of commands.`);
});

bot.on('guildDelete', guild => {
	console.log(`I just left guild ${guild.name} (${guild.id})`);
});

bot.on('message', message => {
	if (message.content.startsWith(`${settings.PREFIX}leave`) && message.guild.voiceConnection) {
		message.guild.voiceConnection.disconnect();
		servers[message.guild.id].queue = [];
		console.log(`${servers[message.guild.id]}: Queue Cleared`);
	}
});

bot.on('message', message => {
	if (message.content.startsWith(`${settings.PREFIX}skip`) && servers[message.guild.id].queue) message.guild.voiceConnection.dispatcher.end();
});

bot.on('error', err => {
	console.log(err);
});

bot.login(process.env.TOKEN);

