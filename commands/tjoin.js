const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx, drawWelcomeImage } = require('../util.js');
const { welcomechannel } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tjoin')
		.setDescription('join test command'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		
		logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /tjoin`);

		await interaction.reply({ files: [await drawWelcomeImage(interaction.member)] });
	},
};