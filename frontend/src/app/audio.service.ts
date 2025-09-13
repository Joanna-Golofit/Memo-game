import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCache = new Map<string, HTMLAudioElement>();

  async playCardSound(audioPath: string) {
    try {
      const fullPath = `http://localhost:3000${audioPath}`;
      
      let audio = this.audioCache.get(fullPath);
      if (!audio) {
        audio = new Audio(fullPath);
        audio.volume = 0.7; // Nie za głośno
        this.audioCache.set(fullPath, audio);
      }
      
      // Reset i odtwórz
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.log('Nie można odtworzyć dźwięku:', error);
    }
  }

  async playSuccessSound() {
    // Dźwięk sukcesu gdy znajdzie parę
    const audio = new Audio('assets/sounds/success.mp3');
    audio.volume = 0.5;
    try {
      await audio.play();
    } catch (error) {
      console.log('Brak dźwięku sukcesu');
    }
  }
}
