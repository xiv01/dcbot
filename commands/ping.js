const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with latency'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /ping\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

		const pingEmbed = new EmbedBuilder()
			.setColor(color.pink)
			.setTitle('🏓 pong')
			.setDescription(`\nbot latency ⇢ \`${Date.now() - interaction.createdTimestamp}ms\`\nAPI latency ⇢ \`${Math.round(interaction.client.ws.ping)}ms\`\n`)
			.setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/4b00003de1780fcf41b50c2b41249811.webp?size=32' });

		await interaction.reply({ embeds: [pingEmbed] });
	},
};