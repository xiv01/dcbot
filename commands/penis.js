const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('penis')
		.setDescription('calculates your pp size'),
	async execute(interaction) {

		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		console.log(`[log] ${interactionUser.user.username} used /penis`);

        let length = Math.floor(Math.random() * 40)
        let ppString = "8";

        for (let i = 0; i < length; i++) {
            ppString += "=";
        }

        ppString += "D";

		const gayembed = new EmbedBuilder()
			.setColor(0x6bfa94)
			.setTitle('Your PP')
			.setDescription(ppString)
		await interaction.reply({ embeds: [gayembed] });
	},
};