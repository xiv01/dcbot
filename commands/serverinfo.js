const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('displays server info'),
	async execute(interaction) {
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

        logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /server`, interaction.guild);

        const serverinfoembed = new EmbedBuilder()
            .setColor(0xf2c6ff)
            .setTitle(`${interaction.guild.name} info`)
            .setDescription(`\nmembers: \`${interaction.guild.memberCount}\` \ncreated: \`${interaction.guild.createdAt}\`\n`)
            .setTimestamp()
            .setFooter({ text: 'developed by max#0135', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/dd0279b8ee7a992c3c18db6b406d1151.png?size=32' });
            
        await interaction.reply({ embeds: [serverinfoembed] });
	},
};