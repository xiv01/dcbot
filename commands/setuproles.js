const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');
const { selfroles } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuproles')
		.setDescription('setup self roles in current channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		interaction.deferReply();
		interaction.deleteReply();
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /setuproles\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

		if(selfroles.length <= 0) await interaction.channel.send('no selfroles in config file');
		for(i = 0; i < selfroles.length; i++) {
			let description = selfroles[i].description + '\n';
			for(j = 0; j < selfroles[i].roles.length; j++) {
				let role = await interaction.guild.roles.cache.find(r => r.name === selfroles[i].roles[j][1])
				description += '\n' + selfroles[i].roles[j][0] + ` ⇢ ${role}\n`; 
			};
			let embed = new EmbedBuilder()
    			.setColor(selfroles[i].color)
    			.setTitle(selfroles[i].title)
    			.setDescription(description)

			let message = await interaction.channel.send({ embeds: [embed] });
			for(j = 0; j < selfroles[i].roles.length; j++) await message.react(selfroles[i].roles[j][0]); 
		};
	},
};