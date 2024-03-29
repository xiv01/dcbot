const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const fs = require('node:fs');
const color = require('../colors.json');
const { addAIMessage } = require('../src/ChatAI.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catpic')
		.setDescription('sends a cute cat picture'),
	async execute(interaction, client) {
		addAIMessage(client, "assistant", "i posted a cute cat picture");
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /catpic\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

        fs.readdir(__dirname + '/../resources/images/catpics', (err, files) => {
            let folderSize = files.length;
            let imageNumber = Math.floor(Math.random() * folderSize) + 1;

			const image = new AttachmentBuilder(__dirname + '/../resources/images/catpics//' + files[imageNumber - 1], { name: 'catpic.png' })

			const catEmbed = new EmbedBuilder()
				.setColor(color.pink)
				.setTitle("**₊✦˚・a cat pic for you!**")
     			.setImage('attachment://catpic.png')
				.setTimestamp()
				.setFooter({text: `Pic #${imageNumber}`});

            interaction.reply({embeds: [catEmbed], files: [image]})
        });
	},
};