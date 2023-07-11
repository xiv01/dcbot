const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logEx } = require('../src/Util.js');
const color = require('../colors.json');

const invalidMember= new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗member is invalid**`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ipresolve')
        .addUserOption(option => option.setName('member').setDescription('victim').setRequired(true))
		.setDescription('resolves a users 100% real ip adress'),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if(typeof user === 'undefined') { 
            await interaction.reply({ embeds: [invalidMember] });
            return;
        };
		logEx(color.commandLog, '📲 Command Used', `<@${interaction.user.id}> used /resolveip <@${user.id}>`, interaction.guild, interaction.member);

        let ip = Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1) + '.' + Math.floor((Math.random() * 254) + 1);
		const ipEmbed  = new EmbedBuilder()
			.setColor(color.defaultLog)
			.setTitle('IP Resolver')
			.setDescription(`**${user.username}'s** IP adress is \`${ip}\``)
		await interaction.reply({ embeds: [ipEmbed] });
	},
};