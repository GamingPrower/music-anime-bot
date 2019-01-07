const Commando = require('discord.js-commando');
require('dotenv/config');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');

const youtube = new Youtube(process.env.YOUTUBE);

function play(connection, message) {
	const server = servers[message.guild.id]; /* global servers, currentSong*/	
	server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: 'audioonly' }));
	server.title.shift();
	server.queue.shift();
	server.dispatcher.on('end', () => {
		if (server.queue[0]) {
			play(connection, message);
		} else {
			message.channel.send('No more songs in queue. Disconnecting.');
			connection.disconnect();
		}
	});
}

class MusicPlayer extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'music',
			aliases: ['sr', 'songrequest', 'play', 'song'],
			group: 'music',
			memberName: 'music',
			description: 'Request music from the web.'
		});
	}

	run(message, args) {
		// Check user/bot status
		const status = [Boolean(message.member.voiceChannel), Boolean(message.guild.voiceConnection), Boolean(servers[message.guild.id])];
		if (!status[0]) return message.reply('Join a voice channel first!');
		if (!args) return message.reply('Usage: \'.music Rick Roll\'');
		if (!status[2]) servers[message.guild.id] = { queue: [], title: [] };
		// Push request into queue and play
		if (!status[1]) {
			message.member.voiceChannel.join()
				.then(connection => {
					youtube.searchVideos(args, 1)
						.then(result => {
							const server = servers[message.guild.id];
							server.title.push(result[0].title);
							server.queue.push(`https://www.youtube.com/watch?v=${result[0].id}`);
							currentSong[message.guild.id] = { queue: [server.queue[0]], title: [server.title[0]] };
							message.reply(`Music Bot Started! Now Playing: **${result[0].title}**`);
							play(connection, message);
						});
				})
				.catch(console.error);
		} else if (status[1]) {
			youtube.searchVideos(args, 1)
				.then(result => {
					const server = servers[message.guild.id];
					server.title.push(result[0].title);
					server.queue.push(`https://www.youtube.com/watch?v=${result[0].id}`);
					currentSong[message.guild.id] = { queue: [server.queue[0]], title: [server.title[0]] };
					message.reply(`**${result[0].title}** has been added to the queue!`);
				})
				.catch(console.error);
		}
	}
}

module.exports = MusicPlayer;
