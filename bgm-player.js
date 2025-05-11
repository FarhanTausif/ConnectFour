const bgmAudio = new Audio();

function playBGM(){
  const bgmFiles = ['../assets/bgm2.mp3','../assets/bgm.mp3'];
  let current = 0;
  
  if(bgmFiles[current]) {
    bgmAudio.src = bgmFiles[current];
  }

  bgmAudio.volume = 0.5; // optional volume
  bgmAudio.play();

  bgmAudio.addEventListener('ended', () => {
    current = (current + 1) % bgmFiles.length; // cycle back to first
    bgmAudio.src = bgmFiles[current];
    bgmAudio.play();
  });
}