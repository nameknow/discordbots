// komutlar/emojiekle.js
const { PermissionsBitField } = require('discord.js');
const { fetch } = require('undici');
const emojiSources = require('../emojiSources');

function sanitizeName(name) {
  // Discord emoji adı kuralları: küçük harf, rakam, _ ve - izinli; 2-32 char
  return name
    .toLowerCase()
    .replace(/[^\w-]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32) || 'emoji';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  name: 'emojiekle',
  description: 'Ön tanımlı kaynaktan türe göre emoji indirip sunucuya yükler. Kullanım: !emojiekle anime',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
      return message.reply('❌ Bu işlemi yapabilmek için "Emojileri ve Stickerları Yönet" iznine sahip olman gerekiyor.');
    }

    const type = (args[0] || '').toLowerCase();
    if (!type) {
      return message.reply(`❌ Lütfen bir tür belirt. Mevcut türler: ${Object.keys(emojiSources).join(', ')}`);
    }

    const urls = emojiSources[type];
    if (!urls || !urls.length) {
      return message.reply(`⚠️ '${type}' için kaynak bulunamadı. emojiSources.js dosyasına o tür için doğrudan image URL'leri ekleyin.`);
    }

    // Kontroller
    const guild = message.guild;
    const maxEmojis = 50; // normal sunucu limiti (Nitro farklı olabilir)
    const availableSlots = maxEmojis - guild.emojis.cache.size;
    if (availableSlots <= 0) {
      return message.reply('❌ Sunucuda yeni emoji eklemek için yer yok (limit dolu).');
    }

    // Sınırlandır: bir seferde en fazla 10 indir-yükle (rate limit ve spam için)
    const toProcess = urls.slice(0, Math.min(urls.length, 10, availableSlots));

    await message.reply(`⏳ ${toProcess.length} emoji indirilecek ve yüklenecek. Lütfen bekleyin...`);

    const created = [];
    const failed = [];

    for (let i = 0; i < toProcess.length; i++) {
      const url = toProcess[i];
      const baseName = `${type}_${i+1}`;
      const name = sanitizeName(baseName);

      try {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Discord, animasyonlu gif için isimlendirme aynı; js sdk handle eder.
        // Create emoji
        const emoji = await guild.emojis.create({ attachment: buffer, name: name });
        created.push(`:${emoji.name}: (${emoji.id})`);
        // küçük bekleme: 1s (rate limit için)
        await sleep(1000);
      } catch (err) {
        console.error('emoji ekleme hata:', err, url);
        failed.push({ url, error: err.message || String(err) });
        // kısa bekleme ve devam et
        await sleep(1200);
      }
    }

    let reply = `✅ İşlem tamamlandı.\nOluşturulan: ${created.length}\nBaşarısız: ${failed.length}\n`;
    if (created.length) reply += `Oluşan emojiler: ${created.join(', ')}\n`;
    if (failed.length) reply += `Hatalar (örnek): ${failed.slice(0,3).map(f=>`${f.url} -> ${f.error}`).join('\n')}`;

    return message.reply(reply);
  }
};
