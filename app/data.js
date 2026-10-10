export const profile = {
  name: "Apar Paudel",
  college: "Gandaki College of Engineering and Science",
  location: "Pokhara, Nepal",
  email: "paudelapar2061@gmail.com",
  github: "https://github.com/aparpaudel22",
  linkedin: "https://www.linkedin.com/in/apar-paudel22",
  facebook: "https://www.facebook.com/apar.paudel.7",
  instagram: "https://www.instagram.com/__apar.paudel/",
  photo: "/images/profile.jpg",
  cv: "/myCV.pdf",
  certificate1: "/CODEIT Course.pdf",
  certificate2: "/EEC SENTI.pdf",
};

export const projects = [
  {
    title: "SentiTrack",
    symbol: "ST",
    categories: ["AI/ML", "Backend"],
    description:
      "A sentiment analysis web application for a single comment or comments collected from a social media post link. It classifies text as positive, negative, or neutral to support business and tourism intelligence. Comment collection used the YouTube Data API v3 and Apify; text was cleaned with Python, Pandas, NLTK, and unicodedata. XLM-R and MuRIL models were fine-tuned with Hugging Face Transformers and PyTorch. Llama 8B was used for monolingual conversion. Training and evaluation used Trackio, scikit-learn, and Hugging Face Evaluate.",
    tools: ["Python", "Pandas", "NLTK", "Transformers", "PyTorch", "Trackio", "Google Colab", "scikit-learn"],
    repo: "https://github.com/aparpaudel22/SentiTrack-SentimentAnalysis",
  },
  {
    title: "Heart Sound Analysis",
    symbol: "♥",
    categories: ["AI/ML", "Backend", "Frontend"],
    description:
      "A machine-learning system that analyzes heart-sound audio features to explore cardiovascular disease detection and improve access to screening in underserved and remote areas. Models were evaluated using the Yaseen dataset. The application includes a Python backend, MySQL database, and an HTML, CSS, and JavaScript interface.",
    tools: ["Python", "Audio analysis", "MySQL", "HTML", "CSS", "JavaScript"],
    repo: "",
  },
  {
    title: "Panchase Online",
    symbol: "P / 102.8",
    categories: ["Frontend", "Backend"],
    description:
      "A full-stack news portal with a live radio feature, inspired by Panchase FM 102.8MHz.",
    tools: ["News portal", "Live radio", "Frontend", "Backend"],
    repo: "https://github.com/aparpaudel22/panchase-online",
  },
  {
    title: "School Website (On Progress)",
    symbol: "S / C",
    categories: ["Frontend", "Backend"],
    description:
      "A school website with separate teacher and student logins so users can access their own details.",
    tools: ["Frontend", "Backend", "Teacher and student accounts"],
    repo: "",
  },
  {
    title: "GlowHive",
    symbol: "G",
    categories: ["Frontend"],
    description:
      "A static frontend for a cosmetics e-commerce website. This project covers the frontend only; it does not include a backend or real checkout.",
    tools: ["Frontend", "Static website", "Cosmetics"],
    repo: "https://github.com/aparpaudel22/GlowHive-Cosmetics",
  },
  {
    title: "BlockCatcher",
    symbol: "[-]",
    categories: ["Frontend", "Game"],
    description:
      "A lightweight browser game for visitors to play while a website is under construction or maintenance. Listed last here as a smaller game project.",
    tools: ["Browser game", "JavaScript"],
    repo: "https://github.com/aparpaudel22/Web_Underconstruction_Site",
  },
];

export const certificates = [
  { title: "IC-AICSE-2026", issuer: "Everest Engineering College", date: "2026", file: profile.certificate2 },
  { title: "React with Next JS", issuer: "CODEIT Nepal", date: "2026", file: profile.certificate1 },
];

export const hobbies = [
  "Singing",
  "Playing musical instruments",
  "Listening to music",
  "Building small experiments",
];

export const playlist = [
  { title: "Sunflower", artist: "Post Malone", src: "/music/Post Malone, Swae Lee - Sunflower (Spider-Man Into the Spider-Verse).mp3", cover: "/music/covers/sunflower.jpg.png"},
  { title: "सिरानमा फोटो छ", artist: "Nepathya", src: "/music/Nepathya - Siran Ma Photo Chha (सिरानमा फोटो छ).mp3", cover: "/music/covers/AmritGurung.png"},
  { title: "Yeh Jo Halka Suroor Hai", artist: "Nusrat Fateh Ali Khan", src: "/music/Yeh Jo Halka Halka Suroor Hai (Lyric Video) Nusrat Fateh Ali Khan - OSA.mp3", cover: "/music/covers/yehjohalkahalka.png"},
];