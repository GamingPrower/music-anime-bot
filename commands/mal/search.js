const path = require('path');
const Promise = require('es6-promise').Promise;
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

	run(message, args) {
		const malSearch = () => {
			const promise = new Promise(resolve => {
				resolve(malScraper.getInfoFromName(args));
			});
			return promise;
		};

		const aniSearch = () => {
			const promise = new Promise(resolve => {
				resolve(masterani.getSearch(args));
			});
			return promise;
		};

		malSearch()
			.then(mal => {
				const malEmbed = new Discord.RichEmbed()
					.setTitle(mal.title)
					.addField('Synopsis', `${mal.synopsis.substr(0, 1020)}...`)
					.setColor(0x000000)
					.setThumbnail(mal.picture)
					.setURL(mal.url)
					.setFooter(`Score: ${mal.score}`);
				message.channel.send(malEmbed);
				return aniSearch();
			})
			.then(ani => {
				const attachment = new Discord.Attachment(path.join(__dirname, '/masterani.jpg'), 'masterani.jpg');
				const aniEmbed = new Discord.RichEmbed()
					.setTitle(`Watch "${ani[0].title} " on Masterani.me`)
					.setDescription('masterani.me - is an anime info database with a streaming option to watch anime in HD.')
					.setURL(ani[0].episodesListHref)
					.setColor(0x000000)
					.attachFile(attachment)
					.setThumbnail('attachment://masterani.jpg');
				message.channel.send(aniEmbed);
			})
			.catch(err => console.error(err));
	}
}

module.exports = MALCommand;
