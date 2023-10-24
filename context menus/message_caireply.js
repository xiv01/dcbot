const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');
const { generateAIResponse, sendReply } = require('../src/ChatAI.js');
const color = require('../colors.json');

const errorEmbed = new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗ cant reply to this message**`)

const successEmbed = new EmbedBuilder()
    .setColor(color.success)
    .setTitle(`**✅ replying to this message**`)

module.exports = {
    data: new ContextMenuCommandBuilder()
    	.setName('Controlled AI reply')
    	.setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        console.log('AIReply' + interaction.targetId);
        
        const modal = new ModalBuilder()
            .setCustomId('AIReply' + interaction.targetId)
            .setTitle('Prompt');

        const promptInput = new TextInputBuilder()
            .setCustomId('promptInput')
            .setLabel("Prompt")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(promptInput));

        await interaction.showModal(modal);
    },
};