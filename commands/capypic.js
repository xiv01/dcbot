const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const fs = require('node:fs');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('capypic')
		.setDescription('sends a cute capybara picture'),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /capypic\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        fs.readdir(__dirname + '/../resources/images/capypics', (err, files) => {
            let folderSize = files.length;
            let imageNumber = Math.floor(Math.random() * folderSize) + 1;

			const image = new AttachmentBuilder(__dirname + '/../resources/images/capypics' + '//' + files[imageNumber - 1], { name: 'capypic.png' })

			const capyembed = new EmbedBuilder()
				.setColor(color.pink)
				.setTitle("**₊✦˚・a capy pic for you!**")
     			.setImage('attachment://capypic.png')
				.setTimestamp()
				.setFooter({
					text: `Pic #${imageNumber}`,
			});

            interaction.reply({embeds: [capyembed], files: [image]})
        });
	},
};