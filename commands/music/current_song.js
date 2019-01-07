const Commando = require('discord.js-commando');
const YTDL = require('ytdl-core');
const Discord = require('discord.js');

class CurrentSongCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'current',
			aliases: ['currentsong', 'cs'],
			group: 'music',
			memberName: 'current',
			description: 'Displays the current song name and URL'
		});
	}

	async run(message) {
		if (message.guild.voiceConnection) {
			const songInfo = await YTDL.getInfo(currentSong[message.guild.id].queue[0]); /* global currentSong */
			const ytEmbed = new Discord.RichEmbed()
				.setTitle(songInfo.title)
				.setDescription(songInfo.description.substr(0, 500))
				.setThumbnail(songInfo.thumbnail_url)
				.setColor(0x000000)
				.setURL(songInfo.video_url)
				.addField(`Channel: ${songInfo.author.name}`, songInfo.author.channel_url);
			message.channel.send(ytEmbed);
		} else {
			message.reply('No songs in queue.');
		}
	}
}

module.exports = CurrentSongCommand;
