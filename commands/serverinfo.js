const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('displays server info'),
	async execute(interaction) {
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
        
        let date = new Date();
		console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${interactionUser.user.username}#${interactionUser.user.discriminator} used /server`);

        const serverinfoembed = new EmbedBuilder()
            .setColor(0x6bfa94)
            .setTitle(`${interaction.guild.name} info`)
            .setDescription(`\nmembers: \`${interaction.guild.memberCount}\` \ncreated: \`${interaction.guild.createdAt}\`\n`)
            .setTimestamp()
            .setFooter({ text: 'developed by max#0135', iconURL: interaction.client.users.fetch('709098824253177859').avatarURL() });
            
        await interaction.reply({ embeds: [serverinfoembed] });
	},
};