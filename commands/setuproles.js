const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuproles')
		.setDescription('setup self roles in current channel'),
	async execute(interaction) {
		const age13role = interaction.guild.roles.cache.find(role => role.name === '13+');
		const age16role = interaction.guild.roles.cache.find(role => role.name === '16+');
		const age18role = interaction.guild.roles.cache.find(role => role.name === '18+');

		const gendermalerole = interaction.guild.roles.cache.find(role => role.name === 'male');
		const genderfemalerole = interaction.guild.roles.cache.find(role => role.name === 'female');
		const genderotherrole = interaction.guild.roles.cache.find(role => role.name === 'other');

		const role1embed = new EmbedBuilder()
    		.setColor(0x0099FF)
    		.setTitle('Age')
    		.setDescription('⚙️ choose your age\n\n1️⃣ ⇢ \`13+\`\n\n2️⃣ ⇢ \`16+\`\n\n3️⃣ ⇢ \`13+\`\n\n')

		const role2embed = new EmbedBuilder()
    		.setColor(0x0099FF)
    		.setTitle('Gender')
    		.setDescription('⚙️ choose your gender\n\n💙 ⇢ \`male\`\n\n💜 ⇢ \`female\`\n\n🤍 ⇢ \`other\`\n\n')

		interaction.deferReply();
		interaction.deleteReply();
		let messageEmbed = await interaction.channel.send({ embeds: [role1embed]  })
		let messageEmbed2 = await interaction.channel.send({ embeds: [role2embed] })

		await messageEmbed.react('1️⃣');
		await messageEmbed.react('2️⃣');
		await messageEmbed.react('3️⃣');

		await messageEmbed2.react('💙');
		await messageEmbed2.react('💜');
		await messageEmbed2.react('🤍');
		
		messageEmbed.client.on('messageReactionAdd', async (reaction, user) => {
			if(reaction.message.partial) await reaction.message.fetch();
			if(reaction.partial) await reaction.fetch();
			if(!reaction.message.guild) return;
			if(user.bot) return;

			if (reaction.message.channel.id == messageEmbed.channel.id) {
				if(reaction.emoji.name === '1️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age13role);
				}
				if(reaction.emoji.name === '2️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age16role);
				}
				if(reaction.emoji.name === '3️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(age18role);
				} 

				if(reaction.emoji.name === '💙') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(gendermalerole);
				} 
				if(reaction.emoji.name === '💜') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(genderfemalerole);
				}
				if(reaction.emoji.name === '🤍') {
					await reaction.message.guild.members.cache.get(user.id).roles.add(genderotherrole);
				}
				
				else {
					return;
				}
			}
		})

		messageEmbed.client.on('messageReactionRemove', async (reaction, user) => {
			if(reaction.message.partial) await reaction.message.fetch();
			if(reaction.partial) await reaction.fetch();
			if(!reaction.message.guild) return;
			if(user.bot) return;

			if (reaction.message.channel.id == messageEmbed.channel.id) {
				if(reaction.emoji.name === '1️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age13role);
				}
				if(reaction.emoji.name === '2️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age16role);
				}
				if(reaction.emoji.name === '3️⃣') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(age18role);
				} 
				
				if(reaction.emoji.name === '💙') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(gendermalerole);
				} 
				if(reaction.emoji.name === '💜') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(genderfemalerole);
				}
				if(reaction.emoji.name === '🤍') {
					await reaction.message.guild.members.cache.get(user.id).roles.remove(genderotherrole);
				}
				
				else {
					return;
				}
			}
		})
	},
};