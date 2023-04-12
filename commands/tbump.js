const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tbump')
		.setDescription('testbump'),
	async execute(interaction) {
        await interaction.channel.sendTyping() 
        const welcomeembed = new EmbedBuilder()
            .setColor(color.pink)
            .setDescription(`Bump erfolgreich!`);

        await interaction.reply({embeds: [welcomeembed] });
	},
};