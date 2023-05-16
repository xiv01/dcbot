const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('post server rules')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        await interaction.deferReply();
        await interaction.deleteReply();
        logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /rules>\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);
        
        const images = fs.readdirSync(path.join(__dirname,'../resources/images/rules')).filter(file => file.endsWith('.jpg'));
		for(const image of images) {
			await interaction.channel.send({ files: [__dirname + '/../resources/images/rules//' + image] })
		};
	},
};