const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('howgay')
		.setDescription('calculates your gayness'),
	async execute(interaction) {
		const gayembed = new EmbedBuilder()
			.setColor(0x6bfa94)
			.setTitle('Calculation Result')
			.setDescription(`\n🏳️‍🌈 your are \`${Math.floor(Math.random() * 101)}\`% gay :)\n`)
		await interaction.reply({ embeds: [gayembed] });
	},
};