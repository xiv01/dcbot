const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logEx } = require('../Util.js');
const color = require('../colors.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createimage')
        .setDescription('create an image using ai')
        .addStringOption(option => option.setName('prompt').setDescription('describe the image you want to generate').setMaxLength(100).setRequired(true)),
	async execute(interaction, client) {
        await interaction.deferReply();
		const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        let prompt = interaction.options.getString('prompt');
		logEx(color.commandLog, '📲 Command Used', `<@${interactionUser.id}> used /createimage \`${prompt}\`\n **channel**: <#${interaction.channel.id}>`, interaction.guild, interactionUser);

        try {
            const response = await client.openAI.createImage({
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            });
            var image_url = response.data.data[0].url;
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle("❗ something went wrong while creating your image :(")

            await interaction.editReply({embeds: [errorEmbed]})
            setTimeout(() => interaction.deleteReply().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
            return;
        };

        const saveButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('save')
                .setURL(image_url)
                .setStyle(5))

        const imageEmbed = new EmbedBuilder()
            .setColor(color.pink)
            .setTitle("**₊✦˚・here is your image**")
            .setImage(image_url)
            .setTimestamp()

    await interaction.editReply({embeds: [imageEmbed], components: [saveButton] })
	},
};