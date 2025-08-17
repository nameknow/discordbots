// index.js
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Komut koleksiyonu
client.commands = new Collection();

// Komutları yükle (komutlar klasörü)
const commandsPath = path.join(__dirname, 'komutlar');
if (!fs.existsSync(commandsPath)) {
  console.error('komutlar klasörü bulunamadı. Lütfen komutlar/ klasörünü oluşturun ve içini doldurun.');
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const command = require(filePath);
    if (command && command.name && typeof command.execute === 'function') {
      client.commands.set(command.name, command);
      console.log(`Yüklendi: ${command.name}`);
    } else {
      console.warn(`Komut yüklenemedi (format hatası): ${file}`);
    }
  } catch (err) {
    console.error(`Komut yüklenirken hata: ${file}`, err);
  }
}

client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı.`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefix = config.prefix || '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error('Komut çalıştırma hatası:', error);
    message.reply('Komut çalıştırılırken hata oluştu.');
  }
});

client.login(config.token);
