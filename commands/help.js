const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const helpembed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('boss bot help')
    .setDescription('Some description here')
    .setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/b02b839c3cb08a00bd7354bc8afda92a.webp?size=32' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('bot usage informations'),
	async execute(interaction) {
		await interaction.reply({ embeds: [helpembed] });
	},
};