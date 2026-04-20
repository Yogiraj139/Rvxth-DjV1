import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) throw new Error("DISCORD_TOKEN missing");

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Bot ping'),

  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play song')
    .addStringOption(o =>
      o.setName('query')
        .setDescription('Song name / URL')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current song'),

  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music'),

  new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause music'),

  new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume music'),

  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show queue'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave VC'),

  new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set volume')
    .addIntegerOption(o =>
      o.setName('amount')
        .setDescription('1-200')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Current song'),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear queue'),

  new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggle loop'),

  new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle queue'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('All commands')
].map(c => c.toJSON());

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(token);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log("✅ Slash Commands Registered");
}

const queue = new Map();

client.once('ready', async () => {
  console.log(`🤖 ${client.user.tag} Online`);
  await deployCommands();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const name = interaction.commandName;

  if (name === 'ping')
    return interaction.reply('🏓 Pong!');

  if (name === 'play') {
    const q = interaction.options.getString('query');
    return interaction.reply(`🎵 Searching: ${q}`);
  }

  if (name === 'skip')
    return interaction.reply('⏭️ Skipped');

  if (name === 'stop')
    return interaction.reply('⏹️ Stopped');

  if (name === 'pause')
    return interaction.reply('⏸️ Paused');

  if (name === 'resume')
    return interaction.reply('▶️ Resumed');

  if (name === 'queue')
    return interaction.reply('📜 Queue Empty');

  if (name === 'leave')
    return interaction.reply('👋 Left VC');

  if (name === 'volume') {
    const v = interaction.options.getInteger('amount');
    return interaction.reply(`🔊 Volume set to ${v}%`);
  }

  if (name === 'nowplaying')
    return interaction.reply('🎶 Nothing playing');

  if (name === 'clear')
    return interaction.reply('🗑️ Queue Cleared');

  if (name === 'loop')
    return interaction.reply('🔁 Loop Toggled');

  if (name === 'shuffle')
    return interaction.reply('🔀 Queue Shuffled');

  if (name === 'help')
    return interaction.reply(`
🎵 **Music Commands**
/play
/skip
/stop
/pause
/resume
/queue
/leave
/volume
/nowplaying
/clear
/loop
/shuffle

⚙️ Utility
/ping
/help
`);
});

client.login(token);
