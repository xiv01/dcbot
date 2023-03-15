const { openaikey } = require('./config.json');
const { logEx } = require('./Util.js');
const color = require('./colors.json');
const { Configuration, OpenAIApi } = require("openai");
module.exports = { chatAI };

async function chatAI(guild, client) {
    logEx(color.defaultLog, '⚙️ System', '🤖 AI Chat is enabled', guild);
    const configuration = new Configuration({
        apiKey: openaikey,
    });
    const openai = new OpenAIApi(configuration);

    client.conversation = [];

    client.on('messageCreate', async message => {
        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content == null) return;

        if (message.mentions.has(client.user)) {
            let prompt = content.replace(/<@\d+>/g, '');
            if(prompt.length > 1) {
                await message.channel.sendTyping(60);
                client.conversation.push({ role: "user", content: prompt });
                if(client.conversation.length > 10) client.conversation.shift();
                try {
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: client.conversation,
                        max_tokens: 700
                    });
                    logEx(color.defaultLog, '🤖 AI Chat', `<@${message.author.id}>: ${content} \n**reply cost**: \`\`${completion.data.usage.total_tokens}\`\` tokens`, guild, message.member);
                    reply = completion.data.choices[0].message.content;
                    client.conversation.push({ role: "assistant", content: reply });
                    if(client.conversation.length > 10) client.conversation.shift();
                    if(reply.length > 2000) {
                        message.reply(reply.substr(0, 2000));
                        for(i = 1; i < reply.length / 2000; i++) {
                            await message.channel.send(reply.substr(0 + (i * 2000), 2000 + (i * 2000)));
                        };
                    } else {
                        await message.reply(reply);
                    };
                } catch (err) {
                    logEx(color.warning, '🤖 AI Error', `**last prompt**: <@${message.author.id}>: ${content}`, guild, message.member);
                    return message.reply('An error occured while i was trying to answer. :(\nI have already informed my creator about this issue and hope it will get resolved ASAP');
                };
            };
        };
    });
};