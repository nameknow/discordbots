// komutlar/setuproles.js
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'setuproles',
  description: 'Emojili ve şekilli rol şablonlarını oluşturur. Kullanım: !setuproles tür',
  async execute(message, args) {
    // İzin kontrolü
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('❌ Bu işlemi yapabilmek için "Rolleri Yönet" iznine sahip olman gerekiyor.');
    }

    // Rol şablonları (emoji + isim + renk + diğer ayarlar)
    const presets = {
      topluluk: [
        { emoji: '🔰', name: 'Kurucu', color: '#8B0000', hoist: true, mentionable: false },
        { emoji: '🛡️', name: 'Admin', color: '#FF4500', hoist: true, mentionable: false },
        { emoji: '🧰', name: 'Mod', color: '#FF8C00', hoist: true, mentionable: false },
        { emoji: '👥', name: 'Üye', color: '#2F3136', hoist: false, mentionable: false },
        { emoji: '✨', name: 'VIP', color: '#FFD700', hoist: false, mentionable: true }
      ],
      oyun: [
        { emoji: '🎮', name: 'Oyuncu', color: '#1E90FF', hoist: false, mentionable: true },
        { emoji: '🏆', name: 'Turnuva', color: '#FFD700', hoist: false, mentionable: true },
        { emoji: '🟢', name: 'Çevrimiçi', color: '#00FF00', hoist: false, mentionable: false },
        { emoji: '🔴', name: 'Çevrimdışı', color: '#FF0000', hoist: false, mentionable: false },
        { emoji: '🛠️', name: 'Organizasyon', color: '#00CED1', hoist: false, mentionable: false }
      ],
      anime: [
        { emoji: '🌸', name: 'Otaku', color: '#FF69B4', hoist: false, mentionable: true },
        { emoji: '🎴', name: 'Manga', color: '#8A2BE2', hoist: false, mentionable: false },
        { emoji: '🎭', name: 'Cosplay', color: '#FFB6C1', hoist: false, mentionable: false },
        { emoji: '⭐', name: 'Moderator', color: '#FF8C00', hoist: true, mentionable: false }
      ],
      roleplay: [
        { emoji: '🎭', name: 'Oyuncu', color: '#C71585', hoist: false, mentionable: true },
        { emoji: '📜', name: 'Yazar', color: '#DAA520', hoist: false, mentionable: false },
        { emoji: '🛡️', name: 'GM', color: '#2E8B57', hoist: true, mentionable: false }
      ],
      eglence: [
        { emoji: '😂', name: 'Mizah', color: '#FFD700', hoist: false, mentionable: true },
        { emoji: '🎵', name: 'Müzik', color: '#1E90FF', hoist: false, mentionable: true },
        { emoji: '🎲', name: 'Oyunlar', color: '#32CD32', hoist: false, mentionable: false }
      ]
    };

    const type = (args[0] || 'topluluk').toLowerCase();
    if (!presets[type]) {
      return message.reply(`⚠️ Geçersiz tür. Mevcut türler: ${Object.keys(presets).join(', ')}`);
    }

    try {
      const created = [];
      for (const roleDef of presets[type]) {
        const roleName = `${roleDef.emoji} ${roleDef.name}`;
        // Aynı isimde rol var mı kontrol et
        const existing = message.guild.roles.cache.find(r => r.name === roleName);
        if (existing) {
          created.push({ name: roleName, status: 'var' });
          continue;
        }

        // Rol oluştur
        await message.guild.roles.create({
          name: roleName,
          color: roleDef.color || 'Default',
          hoist: roleDef.hoist || false,
          mentionable: roleDef.mentionable || false,
          reason: `Rol şablonu oluşturuldu: ${type}`
        });

        created.push({ name: roleName, status: 'oluşturuldu' });
      }

      // Özet mesajı
      const ok = created.filter(c => c.status === 'oluşturuldu').length;
      const exist = created.filter(c => c.status === 'var').length;
      return message.reply(`✅ Rol şablonu uygulandı. Oluşturulan: ${ok}, Zaten var: ${exist}`);
    } catch (err) {
      console.error('setuproles hata:', err);
      return message.reply('❌ Rol oluşturulurken hata oluştu. Botun "Rolleri Yönet" izni olduğundan emin ol.');
    }
  }
};
