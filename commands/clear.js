const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('deletes a given number of messages')
        .addIntegerOption(option => option.setName('messages').setDescription('number of messages to delete').setRequired(true)),
	async execute(interaction) {
		const num = interaction.options.getInteger('messages');

		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		let date = new Date();
		console.log(`[${[date.toLocaleString()]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} used /clear ${num}`);

		if(num <= 0 || num > 100) {
			const clearembed = new EmbedBuilder()
				.setColor(0xfc2332)
				.setTitle('❗ **error**')
            	.setDescription(`invalid number (must be between 1-100)`)

			await interaction.reply({ embeds: [clearembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
		} else {
			await interaction.channel.bulkDelete(num);

			const clearembed = new EmbedBuilder()
				.setColor(0x6bfa94)
				.setTitle('✅ **done**')
				.setDescription(`successfully deleted \`${num}\` messages`)
			
			await interaction.reply({ embeds: [clearembed] });
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
		}
	},
};