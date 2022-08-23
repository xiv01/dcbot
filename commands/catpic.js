const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catpic')
		.setDescription('posts a cat picture'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		console.log(`[log] ${interactionUser.user.username} used /catpic`);

        fs.readdir(__dirname + '/../images/catpics', (err, files) => {
            folderSize = files.length;
            imageNumber = Math.floor(Math.random() * folderSize) + 1;

            interaction.reply({ files: [__dirname + '/../images/catpics' + '//' + files[imageNumber-1]]})
        });
	},
};