const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('links to this bots public github repo'),
	async execute(interaction) {

		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		let date = new Date();
		console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} used /github`);

		const githubembed = new EmbedBuilder()
			.setColor(0x6bfa94)
			.setTitle('GitHub Repository')
            .setURL('https://github.com/xiv01/dcbot/tree/main')
		await interaction.reply({ embeds: [githubembed] });
	},
};