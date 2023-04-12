const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const fs = require('node:fs');
const color = require('../colors.json');
const { addAIMessage } = require('../ChatAI.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catpic')
		.setDescription('sends a cute cat picture'),
	async execute(interaction, client) {
		addAIMessage(client, "assistant", "i posted a cute cat picture");
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /catpic\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        fs.readdir(__dirname + '/../resources/images/catpics', (err, files) => {
            let folderSize = files.length;
            let imageNumber = Math.floor(Math.random() * folderSize) + 1;

			const image = new AttachmentBuilder(__dirname + '/../resources/images/catpics' + '//' + files[imageNumber - 1], { name: 'catpic.png' })

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