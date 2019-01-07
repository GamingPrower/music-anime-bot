const path = require('path');
const Commando = require('discord.js-commando');
const malScraper = require('mal-scraper');
const Discord = require('discord.js');
const masterani = require('masterani-scraper');

class MALCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'mal',
			aliases: ['anime', 'masterani', 'a', 'masteranime'],
			group: 'mal',
			memberName: 'mal',
			description: 'Searches MyAnimeList'
		});
	}

	async run(message, args) {
		const resultsMal = await malScraper.getInfoFromName(args);
		const resultsAni = await masterani.getSearch(args);
		const attachment = new Discord.Attachment(path.join(__dirname, '/masterani.jpg'), 'masterani.jpg');

		const malEmbed = new Discord.RichEmbed()
			.setTitle(resultsMal.title)
			.addField('Synopsis', `${resultsMal.synopsis.substr(0, 1020)}...`)
			.setColor(0x000000)
			.setThumbnail(resultsMal.picture)
			.setURL(resultsMal.url)
			.setFooter(`Score: ${resultsMal.score}`);
		message.channel.send(malEmbed);

		const aniEmbed = new Discord.RichEmbed()
			.setTitle(`Watch "${resultsAni[0].title} " on Masterani.me`)
			.setDescription('masterani.me - is an anime info database with a streaming option to watch anime in HD.')
			.setURL(resultsAni[0].episodesListHref)
			.setColor(0x000000)
			.attachFile(attachment)
			.setThumbnail('attachment://masterani.jpg');
		message.channel.send(aniEmbed);
	}
}

module.exports = MALCommand;
