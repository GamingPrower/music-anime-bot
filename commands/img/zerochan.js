const Commando = require('discord.js-commando');
const search = require('zerochan-scraper');

class ZeroChanCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'zc',
			aliases: ['animesearch', 'searchimage'],
			group: 'img',
			memberName: 'zc',
			description: 'Search for anime pictures on zerochan.net'
		});
	}

	run(message, args) {
		search.getFirstResult(args)
			.then(res => {
				message.channel.send(res);
			})
			.catch(err => console.error(err));
	}
}

module.exports = ZeroChanCommand;
