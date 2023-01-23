const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('display users avatar')
        .addUserOption(option => option.setName('member').setDescription('name of the user').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /avatar <@${member.id}>\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        const avatarURL = member.displayAvatarURL({ dynamic: true, size: 256 });

        const savebutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('save')
                    .setURL(avatarURL)
                    .setStyle(5))

        const avatarembed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`**₊✦˚・${member.user.username}'s avatar**`)
            .setImage(avatarURL)

        await interaction.reply({ embeds: [avatarembed], components: [savebutton] });
    },
};