// komutlar/servercreatechannel.js
const { ChannelType } = require('discord.js');
const templates = require('../templates');

module.exports = {
  name: 'servercreatechannel',
  description: 'Seçilen tür(ler)e göre kategori ve kanallar oluşturur. Kullanım: !servercreatechannel tür tür2',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageChannels')) {
      return message.reply('❌ Bu işlemi yapabilmek için "Kanalları Yönet" iznine sahip olman gerekiyor.');
    }

    if (!args.length) {
      return message.reply(`❌ Lütfen en az bir tür belirt. Mevcut türler: ${Object.keys(templates).join(', ')}`);
    }

    const toCreate = [];
    for (const arg of args.slice(0, 4)) {
      const key = arg.toLowerCase();
      if (!templates[key]) {
        await message.reply(`⚠️ '${arg}' için şablon bulunamadı. Mevcut türler: ${Object.keys(templates).join(', ')}`);
        continue;
      }
      toCreate.push({ key, channels: templates[key] });
    }

    if (!toCreate.length) return;

    await message.reply('⏳ Şablonlar oluşturuluyor... (lütfen bekleyin)');

    try {
      for (const block of toCreate) {
        const category = await message.guild.channels.create({
          name: `📂・${block.key}`,
          type: ChannelType.GuildCategory
        });

        for (const ch of block.channels) {
          const cType = ch.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
          await message.guild.channels.create({
            name: ch.name,
            type: cType,
            parent: category.id
          });
        }
      }

      return message.reply('✅ Seçilen türler için kategoriler ve kanallar oluşturuldu!');
    } catch (err) {
      console.error('servercreatechannel hata:', err);
      return message.reply('❌ Kanal oluşturulurken hata oluştu. Botun gerekli izinleri (KANALLARI YÖNET, KATEGORİ OLUŞTUR) olduğundan emin ol.');
    }
  }
};
