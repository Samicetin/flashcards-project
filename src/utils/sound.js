// Place these in public/sounds/
// goat.mp3 and crowd.mp3 must be added to the public/sounds/ directory for this to work.



export function playSound(src) {
  const audio = new window.Audio(src);
  audio.play();
}
