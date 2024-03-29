const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const fs = require('node:fs');
const { addAIMessage } = require('../src/ChatAI.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('capypic')
		.setDescription('sends a cute capybara picture'),
	async execute(interaction, client) {
		addAIMessage(client, "assistant", "i posted a cute capybara picture");
        logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /capypic\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

        fs.readdir(__dirname + '/../resources/images/capypics', (err, files) => {
            let folderSize = files.length;
            let imageNumber = Math.floor(Math.random() * folderSize) + 1;

			const image = new AttachmentBuilder(__dirname + '/../resources/images/capypics//' + files[imageNumber - 1], { name: 'capypic.png' })

			const capyEmbed = new EmbedBuilder()
				.setColor(color.pink)
				.setTitle("**₊✦˚・a capy pic for you!**")
     			.setImage('attachment://capypic.png')
				.setTimestamp()
				.setFooter({text: `Pic #${imageNumber}`});

            interaction.reply({embeds: [capyEmbed], files: [image]})
        });
	},
};