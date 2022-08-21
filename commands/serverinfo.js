const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('displays server info'),
	async execute(interaction) {
        const serverinfoembed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('boss server info')
            .setDescription(`\nmembers: \`${interaction.guild.memberCount}\` \ncreated: \`${interaction.guild.createdAt}\`\n`)
            .setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/b02b839c3cb08a00bd7354bc8afda92a.webp?size=32' });
            
        await interaction.reply({ embeds: [serverinfoembed] });
	},
};