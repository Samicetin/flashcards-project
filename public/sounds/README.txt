// Place these files in public/sounds/
// goat.mp3 and crowd.mp3 must be added to the public/sounds/ directory for this to work.

import React, { useEffect } from "react";

export function playSound(src) {
  const audio = new window.Audio(src);
  audio.play();
}
