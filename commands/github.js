const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('links to this bots public github repo'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		
		logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /github`, interaction.guild);

		const githubembed = new EmbedBuilder()
			.setColor(0xf2c6ff)
			.setTitle('GitHub Repository')
            .setURL('https://github.com/xiv01/dcbot/tree/main')
		await interaction.reply({ embeds: [githubembed] });
	},
};