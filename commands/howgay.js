const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('howgay')
		.setDescription('calculates your gayness'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		
		logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /howgay`, interaction.guild);

		const gayembed = new EmbedBuilder()
			.setColor(0xf2c6ff)
			.setTitle('Calculation Result')
			.setDescription(`\n🏳️‍🌈 your are \`${Math.floor(Math.random() * 101)}\`% gay :)\n`)
		await interaction.reply({ embeds: [gayembed] });
	},
};