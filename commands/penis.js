const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('penis')
		.setDescription('calculates your pp size'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);

        let length = Math.floor(Math.random() * 30)
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /penis\n**length**: \`\`${length}\`\`\n**Channel**: <#${interaction.channel.id}>`, interaction.guild);
        let ppString = "8";

        for (let i = 0; i < length; i++) {
            ppString += "=";
        };

        ppString += "D";

		const gayembed = new EmbedBuilder()
			.setColor(color.pink)
			.setTitle('Your PP')
			.setDescription(ppString)
		await interaction.reply({ embeds: [gayembed] });
	},
};