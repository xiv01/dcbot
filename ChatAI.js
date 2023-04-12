const { chatAIToggle, chatAIMemory, badwords } = require('./config.json');
const { logEx } = require('./Util.js');
const color = require('./colors.json');
module.exports = { chatAI, addAIMessage };

function addAIMessage(client, role, input) {
    if(chatAIToggle) {
        client.conversation.push({ role: role, content: input });
        if(client.conversation.length > chatAIMemory) client.conversation.shift();
    };
};

async function chatAI(guild, client) {
    logEx(color.defaultLog, '⚙️ System', '🤖 AI Chat is enabled', guild);
    client.conversation = [];

    client.on('messageCreate', async message => {
        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content == null) return;
        if(content.includes("discord.gg/") || content.includes("discordapp.com/invite/") || content.includes("discord.com/invite/") || content.includes("@everyone") || content.includes("@here")) return;
        for(var i = 0; i < badwords.length; i++) if(content.includes(badwords[i])) return;
        
        if(!message.mentions.has(client.user)) { 
            let coversationInput = message.content;
            if(message.stickers.size > 0) coversationInput += ` sticker: ${message.stickers.first().name}`;
            addAIMessage(client, "user", message.member.displayName + " said: " + coversationInput);
        };

        if (message.mentions.has(client.user)) {
            let prompt = content.replace(/<@\d+>/g, '');
            if(prompt.length > 1) {
                await message.channel.sendTyping()
                const typing = setInterval(() => { message.channel.sendTyping() }, 5000);
                addAIMessage(client, "system", "you are a discord bot taking part in the chat of a discord server your primary language should be german");
                addAIMessage(client, "user", message.member.displayName + " said to you: " + prompt);
                try {
                    const completion = await client.openAI.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: client.conversation,
                        max_tokens: 2000
                    });
                    logEx(color.defaultLog, '🤖 AI Chat', `<@${message.author.id}>: ${content} \n**reply cost**: \`\`${completion.data.usage.total_tokens}\`\` tokens`, guild, message.member);
                    reply = completion.data.choices[0].message.content;
                    addAIMessage(client, "assistant", reply);
                    reply = reply.replaceAll('@', '@ ');
                    for(var i = 0; i < badwords.length; i++) {
                        if(reply.includes(badwords[i])) {
                            let censor = '';
                            for(var j = 0; j < badwords[i].length; j++) censor += '\\*';
                            reply = reply.replaceAll(badwords[i], censor);
                        };
                    };
                    clearInterval(typing);
                    if(reply.length > 2000) {
                        try {
                            await message.reply(reply.substr(0, 2000));
                        } catch {
                            await message.channel.send(reply.substr(0, 2000));
                        };
                        for(i = 1; i < reply.length / 2000; i++) {
                            await message.channel.send(reply.substr(0 + (i * 2000), 2000 + (i * 2000)));
                        };
                    } else {
                        try {
                            await message.reply(reply);
                        } catch {
                            await message.channel.send(reply);
                        };
                    };
                } catch (err) {
                    logEx(color.warning, '🤖 AI Error', `**last prompt**: <@${message.author.id}>: ${content}`, guild, message.member);
                    return message.reply('An error occured while i was trying to answer. :(\nI have already informed my creator about this issue and hope it will get resolved ASAP');
                };
            };
        };
    });
};