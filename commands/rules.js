const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('post server rules')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        interaction.deferReply();
        interaction.deleteReply();
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /rules>\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        await interaction.channel.send({ files: ['./resources/images/rules/rule1.jpg', 
                                          './resources/images/rules/rule2.jpg', 
                                          './resources/images/rules/rule3.jpg', 
                                          './resources/images/rules/rule4.jpg', 
                                          './resources/images/rules/rule5.jpg', 
                                          './resources/images/rules/rule6.jpg', 
                                          './resources/images/rules/rule7.jpg'
                                        ]});
	},
};