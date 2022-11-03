const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../util.js');

const rulesembed = new EmbedBuilder()
    .setColor(0xf08fff)
    .setTitle('⏧·₊̣̇.  𝐒𝐞𝐫𝐯𝐞𝐫 𝐑𝐮𝐥𝐞𝐬')
    .setDescription('ˀˀ↷ sexismus, homophobie und rasissmus jeglicher art wird nicht toleriert.\n\nˀˀ↷ kein hass, respektiert jeden. \n\nˀˀ↷ kein nsfw freunde der sonne. \n\nˀˀ↷ schickt cat pics wenn ihr welche habt. \n\nˀˀ↷ ear-rape ist nicht so nice also lasst es. \n\nˀˀ↷ beleidigungen müssen jetzt echt nicht sein. \n\nˀˀ↷ keine werbung.\n\nˀˀ↷ spamt nicht.')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('post server rules'),
	async execute(interaction) {
        interaction.deferReply();
        interaction.deleteReply();
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

        logEx(`${interactionUser.user.username}#${interactionUser.user.discriminator} used /rules`, interaction.guild);

        await interaction.channel.send({ embeds: [rulesembed] });
	},
};