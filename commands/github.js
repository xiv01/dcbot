const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('links to this bots public github repo'),
	async execute(interaction) {
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /github\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

		const githubEmbed = new EmbedBuilder()
			.setColor(color.defaultLog)
			.setTitle('GitHub Repository')
            .setURL('https://github.com/xiv01/dcbot/tree/main')
			
		await interaction.reply({ embeds: [githubEmbed] });
	},
};