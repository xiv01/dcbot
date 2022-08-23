const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuproles')
		.setDescription('setup self roles in current channel'),
	async execute(interaction) {
		interaction.deferReply();
		interaction.deleteReply();

		const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
		console.log(`[log] ${interactionUser.user.username} used /setuproles`);

		const role1embed = new EmbedBuilder()
    		.setColor(0x98b1c8)
    		.setTitle('Age')
    		.setDescription('⚙️ choose your age\n\n1️⃣ ⇢ \`13+\`\n\n2️⃣ ⇢ \`16+\`\n\n3️⃣ ⇢ \`18+\`\n\n')

		const role2embed = new EmbedBuilder()
    		.setColor(0xc8af98)
    		.setTitle('Gender')
    		.setDescription('⚙️ choose your gender\n\n💙 ⇢ \`male\`\n\n💜 ⇢ \`female\`\n\n🤍 ⇢ \`other\`\n\n')

		const role3embed = new EmbedBuilder()
    		.setColor(0x98c8c7)
    		.setTitle('Pronouns')
    		.setDescription('⚙️ choose your pronouns\n\n💫 ⇢ \`he/him\`\n\n⭐ ⇢ \`she/her\`\n\n🌟 ⇢ \`they/them\`\n\n✨ ⇢ \`it/it\`\n\n')

		const role4embed = new EmbedBuilder()
    		.setColor(0xc898b1)
    		.setTitle('Personality')
    		.setDescription('⚙️ choose your personality\n\n💗 ⇢ \`femboy\`\n\n🖤 ⇢ \`emo\`\n\n💪 ⇢ \`gym bro\`\n\n🎮 ⇢ \`gamer\`\n\n')

		let messageEmbed = await interaction.channel.send({ embeds: [role1embed]  })
		let messageEmbed2 = await interaction.channel.send({ embeds: [role2embed] })
		let messageEmbed3 = await interaction.channel.send({ embeds: [role3embed] })
		let messageEmbed4 = await interaction.channel.send({ embeds: [role4embed] })

		await messageEmbed.react('1️⃣');
		await messageEmbed.react('2️⃣');
		await messageEmbed.react('3️⃣');

		await messageEmbed2.react('💙');
		await messageEmbed2.react('💜');
		await messageEmbed2.react('🤍');

		await messageEmbed3.react('💫');
		await messageEmbed3.react('⭐');
		await messageEmbed3.react('🌟');
		await messageEmbed3.react('✨');

		await messageEmbed4.react('💗');
		await messageEmbed4.react('🖤');
		await messageEmbed4.react('💪');
		await messageEmbed4.react('🎮');
	},
};