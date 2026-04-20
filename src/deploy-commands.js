import 'dotenv/config';
import {
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType
} from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) throw new Error("DISCORD_TOKEN missing");
if (!clientId) throw new Error("CLIENT_ID missing");
if (!guildId) throw new Error("GUILD_ID missing");

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping bot'),

  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play song')
    .addStringOption(o =>
      o.setName('query')
        .setDescription('Song / URL')
        .setRequired(true))
    .addChannelOption(o =>
      o.setName('channel')
        .setDescription('Voice channel')
        .addChannelTypes(
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show queue'),

  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip song'),

  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave VC'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help menu')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

await rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: commands }
);

console.log("✅ Slash commands deployed");
