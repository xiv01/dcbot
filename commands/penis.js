const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('penis')
		.setDescription('calculates your pp size'),
	async execute(interaction) {
        let length = Math.floor(Math.random() * 30);
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /penis\n**length**: \`${length}\`\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

        let ppString = '8';
        for (let i = 0; i < length; i++) ppString += '=';
        ppString += 'D';

		const gayEmbed  = new EmbedBuilder()
			.setColor(color.pink)
			.setTitle('Your PP')
			.setDescription(ppString)
		await interaction.reply({ embeds: [gayEmbed] });
	},
};