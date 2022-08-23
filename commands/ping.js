const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with latency'),
	async execute(interaction) {

		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		let date = new Date();
		console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} used /ping`);

		const pingembed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('🏓 pong')
			.setDescription(`\nbot latency ⇢ \`${Date.now() - interaction.createdTimestamp}ms\`\nAPI latency ⇢ \`${Math.round(interaction.client.ws.ping)}ms\`\n`)
			.setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/b02b839c3cb08a00bd7354bc8afda92a.webp?size=32' });
		await interaction.reply({ embeds: [pingembed] });
	},
};