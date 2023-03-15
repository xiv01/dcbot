const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const color = require('../colors.json');
const { welcomechannel, rulesChannel } = require('../config.json');
const { drawWelcomeImage } = require('../Util.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tjoin')
		.setDescription('testjoin'),
	async execute(interaction) {
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);   
		const image = new AttachmentBuilder(await drawWelcomeImage(interactionUser), { name: 'welcome.png' })
        const welcomeembed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`🎉 **Willkommen ${interactionUser.tag} auf ₊˚✦ cozy community!!**`)
            .setDescription(`Wir freuen uns auf dich und wünschen dir viel Spaß!\nBitte lese zuerst die Regeln in <#${rulesChannel}> :)`)
            .setImage('attachment://welcome.png')
            .setTimestamp()
            .setFooter({
                text: `du bist member #${interaction.guild.memberCount}`,
        });
        await interaction.guild.channels.cache.get(welcomechannel).send({embeds: [welcomeembed], files: [image]});
	},
};