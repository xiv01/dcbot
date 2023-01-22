const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const { welcomechannel, rulesChannel } = require('../config.json');
const { logEx, drawWelcomeImage } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tjoin')
		.setDescription('join test command')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /tjoin <@${member.id}>\n**Channel**: <#${interaction.channel.id}>`, interaction.guild);

		const image = new AttachmentBuilder(await drawWelcomeImage(interaction.member), { name: 'welcome.png' })
		const welcomeembed = new EmbedBuilder()
			.setColor(color.pink)
			.setTitle(`🎉 **Willkommen ${interactionUser.user.username} auf ₊˚✦ cozy community!!**`)
			.setDescription(`Wir freuen uns auf dich und wünschen dir viel Spaß!\nBitte lese zuerst die Regeln in <#${rulesChannel}> :)`)
			.setImage('attachment://welcome.png')
			.setTimestamp()
			.setFooter({
				text: `du bist member #${interaction.guild.memberCount}`,
		});

		await interaction.member.guild.channels.cache.get(welcomechannel).send({embeds: [welcomeembed], files: [image]});
		//await interaction.reply({ files: [await drawWelcomeImage(interaction.member)] });
	},
};