require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const config = new Configuration({
    apiKey: process.env.API,
  });

const openai = new OpenAIApi(config);

client.once('ready', async() => {
  console.log(`Bot is online, invite link for ${client.user.username}: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=687195278400&scope=bot`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; 
    if (message.channel.id !== process.env.CHANNEL) return; 
    if (message.content.startsWith("!")) return;
    const prompt = message.content; 
  
    const replay = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        }); 
        message.reply(replay.data.choices[0].text);
	console.log(`User ${message.author.username} asked:" ${prompt}"`)
    });

client.login(process.env.TOKEN);
