const { ContextMenuCommandBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
    	.setName('kick with message')
    	.setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
		const modal = new ModalBuilder()
        .setCustomId('kickModal' + interaction.targetUser.id)
        .setTitle(`kick ${interaction.targetUser.username}`);

        const reasonInput = new TextInputBuilder()
            .setCustomId('kickReasonInput')
            .setLabel("reason")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));

        await interaction.showModal(modal);
    },
};