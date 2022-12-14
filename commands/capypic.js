const { SlashCommandBuilder } = require('discord.js');
const { logEx } = require('../util.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('capypic')
		.setDescription('posts a capybara picture'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		
		logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /capypic`, interaction.guild);

        fs.readdir(__dirname + '/../images/capypics', (err, files) => {
            let folderSize = files.length;
            let imageNumber = Math.floor(Math.random() * folderSize) + 1;

            interaction.reply({ files: [__dirname + '/../images/capypics' + '//' + files[imageNumber-1]]})
        });
	},
};