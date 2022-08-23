const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('capypic')
		.setDescription('posts a capybara picture'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        let date = new Date();
		console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} used /capypic`);

        fs.readdir(__dirname + '/../images/capypics', (err, files) => {
            folderSize = files.length;
            imageNumber = Math.floor(Math.random() * folderSize) + 1;

            interaction.reply({ files: [__dirname + '/../images/capypics' + '//' + files[imageNumber-1]]})
        });
	},
};