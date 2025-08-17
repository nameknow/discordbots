# Discord Template Bot - Paket

Bu paket, Discord sunucu şablonları, emojiler ve emojili roller oluşturman için hazır komutlar içerir.

## Dosya yapısı
```
/discord_template_bot
  package.json
  config.json
  index.js
  templates.js
  emojiSources.js
  /komutlar
    servercreatechannel.js
    setuproles.js
    emojiekle.js
```

## Kurulum
1. Node.js (16+) kurulu olmalı.
2. Dependeny'leri yükle:
   ```bash
   npm install
   ```
3. `config.json` içindeki `token` alanına bot token'ını yaz.
4. Botu çalıştır:
   ```bash
   npm start
   ```

## Komutlar
- `!servercreatechannel <tür> [tür2 ...]` — templates.js içindeki türlere göre kategoriler ve kanallar oluşturur.
- `!setuproles <tür>` — emojili roller oluşturur.
- `!emojiekle <tür>` — emojiSources.js içindeki URL listesinden emojileri indirip sunucuya yükler.

## Önemli Notlar
- Botun çalışması için **Message Content Intent** ve gerekli izinler (`Manage Channels`, `Manage Roles`, `Manage Emojis and Stickers`) etkin olmalıdır.
- Sunucu emojileri limiti normalde 50'dir; Nitro varsa daha fazladır.
- 18 yaş altı kullanıcılar için ebeveyn/vasinin onayı ile hareket edin. Hesap ve ödeme işlemlerinde ebeveyn hesabı kullanın.
