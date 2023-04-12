const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('howgay')
		.setDescription('calculates your gayness'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /howgay\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

		const gayEmbed = new EmbedBuilder()
			.setColor(color.pink)
			.setTitle('Calculation Result')
			.setDescription(`\n🏳️‍🌈 your are \`${Math.floor(Math.random() * 101)}\`% gay :)\n`)
		await interaction.reply({ embeds: [gayEmbed] });
	},
};