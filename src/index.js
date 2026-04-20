import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
  ChannelType
} from 'discord.js';

const token = String(process.env.DISCORD_TOKEN || '')
  .trim()
  .replace(/^["']|["']$/g, '');

console.log("TOKEN LENGTH:", token.length);
console.log("TOKEN DOTS:", (token.match(/\./g) || []).length);
console.log("TOKEN START:", token.slice(0, 12));

if (!token) throw new Error("DISCORD_TOKEN missing");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = interaction.commandName;

  if (cmd === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  if (cmd === 'play') {
    const query = interaction.options.getString('query');
    const channel = interaction.options.getChannel('channel');

    if (!channel || ![
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice
    ].includes(channel.type)) {
      return interaction.reply({
        content: '❌ Select a voice channel',
        ephemeral: true
      });
    }

    return interaction.reply(
      `🎵 Playing: ${query}\n📢 VC: ${channel.name}`
    );
  }

  if (cmd === 'queue') {
    return interaction.reply('📜 Queue empty');
  }

  if (cmd === 'skip') {
    return interaction.reply('⏭️ Skipped');
  }

  if (cmd === 'stop') {
    return interaction.reply('⏹️ Stopped');
  }

  if (cmd === 'leave') {
    return interaction.reply('👋 Left VC');
  }

  if (cmd === 'help') {
    return interaction.reply(`
🎵 Commands:
/ping
/play
/queue
/skip
/stop
/leave
/help
`);
  }
});

client.login(token);
