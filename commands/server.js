const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('displays server info'),
	async execute(interaction) {
        logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /server <@${interaction.user.id}>\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

        const serverInfoEmbed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`${interaction.guild.name} info`)
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`\n**members**: \`${interaction.guild.memberCount}\` \n **created**: \`${interaction.guild.createdAt.toString().slice(0, -40)}\`\n`)
            .setTimestamp()
            .setFooter({ text: 'developed by 03max', iconURL: 'https://cdn.discordapp.com/avatars/709098824253177859/4b00003de1780fcf41b50c2b41249811.webp?size=32' });
        
        await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};