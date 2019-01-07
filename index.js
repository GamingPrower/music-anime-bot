const path = require('path');
const Commando = require('discord.js-commando');
require('dotenv/config');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer().listen(port);

const bot = new Commando.Client({
	commandPrefix: process.env.PREFIX,
	disableEveryone: true,
	unknownCommandResponse: false
});

bot.registry.registerGroup('music', 'Music');
bot.registry.registerGroup('mal', 'MyAnimeList');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(path.join(__dirname, '/commands'));

global.servers = {}; /* global servers, currentSong */
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
	guild.owner.send(`Thanks for adding the bot! You can type ${process.env.PREFIX}help for a list of commands.`);
});

bot.on('guildDelete', guild => {
	console.log(`I just left guild ${guild.name} (${guild.id})`);
});

bot.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}leave`) && message.guild.voiceConnection) {
		message.guild.voiceConnection.disconnect();
		servers[message.guild.id].queue = [];
		console.log(`${message.guild.id}: Queue Cleared`);
	}
});

bot.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}skip`) && servers[message.guild.id].queue[0]) {
		message.reply(`Song Skipped! Now Playing: **${currentSong[message.guild.id].title[0]}**`);
		message.guild.voiceConnection.dispatcher.end();
	} else if (message.content.startsWith(`${process.env.PREFIX}skip`) && !servers[message.guild.id].queue[0]) {
		message.guild.voiceConnection.dispatcher.end();
	}
});

bot.on('error', err => {
	console.log(err);
});

bot.login(process.env.TOKEN);
