const { ContextMenuCommandBuilder, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
    	.setName('ban with message')
    	.setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
		const modal = new ModalBuilder()
        .setCustomId('banModal' + interaction.targetUser.id)
        .setTitle(`ban ${interaction.targetUser.username}`);

        const reasonInput = new TextInputBuilder()
            .setCustomId('banReasonInput')
            .setLabel("reason")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));

        await interaction.showModal(modal);
    },
};