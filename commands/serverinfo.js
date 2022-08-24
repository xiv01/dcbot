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
            .setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/b02b839c3cb08a00bd7354bc8afda92a.webp?size=32' });
            
        await interaction.reply({ embeds: [serverinfoembed] });
	},
};