const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('display users banner')
        .addUserOption(option => option.setName('member').setDescription('name of the user').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /banner <@${member.id}>\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        const failedEmbed = new EmbedBuilder()
            .setColor(color.warning)
            .setTitle('❗ **failed**')
            .setDescription(`this user does not have a banner`)

        await member.user.fetch(true).then(async user => {
            let bannerURL = await user.bannerURL({ dynamic: true, size: 4096 });
            if(bannerURL === null) {
                await interaction.reply({ embeds: [failedEmbed] });
                setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            } else {
                const saveButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('save')
                            .setURL(bannerURL)
                            .setStyle(5))

                const avatarEmbed = new EmbedBuilder()
                    .setColor(color.pink)
                    .setTitle(`**₊✦˚・${member.user.username}'s banner**`)
                    .setImage(bannerURL)

                await interaction.reply({ embeds: [avatarEmbed], components: [saveButton] });
            };
        }).catch(console.error)
    },
};