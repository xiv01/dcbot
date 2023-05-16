const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗member is invalid**`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('display users avatar')
        .addUserOption(option => option.setName('member').setDescription('name of the user').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        if(typeof member === 'undefined') {
            await interaction.reply({ embeds: [invalidMember] });
            return;
        };
        logEx(color.commandLog, '📲 Command Used', `<@${interaction.member.id}> used /avatar <@${member.id}>\n**channel**: <#${interaction.channel.id}>`, interaction.guild, interaction.member);

        const avatarURL = member.displayAvatarURL({ dynamic: true, size: 256 });

        const saveButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('save')
                    .setURL(avatarURL)
                    .setStyle(5))

        const avatarEmbed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle(`**₊✦˚・${member.displayName}'s avatar**`)
            .setImage(avatarURL)

        await interaction.reply({ embeds: [avatarEmbed], components: [saveButton] });
    },
};