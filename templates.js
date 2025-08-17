// templates.js
// Buraya istediğin kadar tür ve kanal şablonu ekle. name: kanal ismi, type: "text" | "voice"
module.exports = {
  topluluk: [
    { name: "📢・duyurular", type: "text" },
    { name: "💬・genel-sohbet", type: "text" },
    { name: "🤝・tanışma", type: "text" },
    { name: "🎉・etkinlikler", type: "text" }
  ],
  anime: [
    { name: "🌸・anime-sohbet", type: "text" },
    { name: "🎬・anime-öneri", type: "text" },
    { name: "🎨・fan-art", type: "text" },
    { name: "📺・izleme-partisi", type: "voice" }
  ],
  roleplay: [
    { name: "🎭・rp-genel", type: "text" },
    { name: "📖・rp-karakterler", type: "text" },
    { name: "🏰・rp-dünya", type: "text" },
    { name: "🏟・rp-ses", type: "voice" }
  ],
  oyun: [
    { name: "🎮・oyun-sohbet", type: "text" },
    { name: "🕹・takım-bul", type: "text" },
    { name: "🏆・turnuvalar", type: "text" },
    { name: "🔊・oyun-ses", type: "voice" }
  ],
  eglence: [
    { name: "😂・meme", type: "text" },
    { name: "🎵・müzik", type: "text" },
    { name: "🎲・mini-oyunlar", type: "text" }
  ]
};
