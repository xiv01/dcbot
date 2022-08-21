const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const rulesembed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription('Some description here')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('post server rules'),
	async execute(interaction) {
        interaction.deferReply();
        interaction.deleteReply();
        await interaction.channel.send({ embeds: [rulesembed] });
	},
};