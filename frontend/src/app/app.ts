import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
// Definicja karty (jak w backend)
interface Card {
  _id: string;
  id: string;
  name: string;
  imagePath: string;
  audioPath: string;
  category: string;
  isFlipped?: boolean;
  isMatched?: boolean;
  position?: number;
}
import { AudioService } from './audio.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private audioService = inject(AudioService);
  protected readonly title = signal('MEMO MIX');
  protected readonly cards = signal<Card[]>([]);
  protected readonly flippedCards = signal<Card[]>([]); 

    // NOWE SYGNAŁY:
    protected readonly gamePhase = signal<'preview' | 'playing' | 'finished'>('preview');
    protected readonly previewTimeLeft = signal<number>(5);
    protected readonly player1Score = signal<number>(0);
    protected readonly player2Score = signal<number>(0);
    protected readonly currentPlayer = signal<number>(0); // 0 = Inka, 1 = Natan

  // NOWY sygnał dla restart
  protected readonly showRestartConfirm = signal<boolean>(false);

  ngOnInit() {
    this.loadCards();
  }

  private async loadCards() {
    try {
      // Pobierz karty z backend API
      const response = await this.http.get<Card[]>('http://localhost:3000/api/cards').toPromise();
      if (response) {
       // Weź pierwsze 8 kart i stwórz pary
        const firstEight = response.slice(0, 8);
        const pairs = [...firstEight, ...firstEight];
        
        // Dodaj pozycje i stan
        const gameCards = pairs.map((card, index) => ({
          ...card,
          position: index,
          isFlipped: true,
          isMatched: false
        }));
        
        // Wymieszaj
        const shuffled = this.shuffleArray(gameCards);
        this.cards.set(shuffled);
        console.log('Załadowane karty z parami:', shuffled);
      }

           // Rozpocznij preview countdown
           this.startPreview();

    } catch (error) {
      console.error('Błąd ładowania kart:', error);
    }
  }

  // NOWA FUNKCJA: Preview phase
  private startPreview() {
    const countdown = setInterval(() => {
      const timeLeft = this.previewTimeLeft();
      if (timeLeft > 1) {
        this.previewTimeLeft.set(timeLeft - 1);
      } else {
        clearInterval(countdown);
        this.startGame();
      }
    }, 1000);
  }
  
  // NOWA FUNKCJA: Rozpocznij grę
  private startGame() {
    // Ukryj wszystkie karty
    this.cards.update(cards => 
      cards.map(card => ({ ...card, isFlipped: false }))
    );
    this.gamePhase.set('playing');
    console.log('Gra rozpoczęta!');
  }
  

   // Funkcja do mieszania
   private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  protected async onCardClick(clickedCard: Card) {
    // Nie pozwól klikać podczas preview
    if (this.gamePhase() === 'preview') {
      return;
    }
    
    if (clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }
    
    if (this.flippedCards().length >= 2) {
      return;
    }
    
    // Odwróć kartę
    this.cards.update(cards => 
      cards.map(card => 
        card.position === clickedCard.position 
          ? { ...card, isFlipped: true }
          : card
      )
    );
    
    // ODTWÓRZ DŹWIĘK KARTY
    await this.audioService.playCardSound(clickedCard.audioPath);
    
    this.flippedCards.update(flipped => [...flipped, clickedCard]);
    
    if (this.flippedCards().length === 2) {
      setTimeout(() => this.checkMatch(), 1500); // Wydłuż na audio
    }
  }
  
  private async checkMatch() {
    const [first, second] = this.flippedCards();
    
    if (first.id === second.id) {
      // MATCH! 
      this.cards.update(cards =>
        cards.map(card =>
          card.position === first.position || card.position === second.position
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      // ODTWÓRZ DŹWIĘK SUKCESU
      await this.audioService.playSuccessSound();
      
      // Dodaj punkt
      if (this.currentPlayer() === 0) {
        this.player1Score.update(score => score + 1);
      } else {
        this.player2Score.update(score => score + 1);
      }
      
      console.log(`MATCH! ${first.name}`);
      this.checkGameEnd();
    } else {
      // NO MATCH
      this.cards.update(cards =>
        cards.map(card =>
          card.position === first.position || card.position === second.position
            ? { ...card, isFlipped: false }
            : card
        )
      );
      
      this.currentPlayer.update(player => player === 0 ? 1 : 0);
    }
    
    this.flippedCards.set([]);
  }
  
  // NOWA FUNKCJA: Sprawdź koniec gry
  private checkGameEnd() {
    const allMatched = this.cards().every(card => card.isMatched);
    if (allMatched) {
      this.gamePhase.set('finished');
      const winner = this.player1Score() > this.player2Score() ? 'Inka' : 
                    this.player2Score() > this.player1Score() ? 'Lorena' : 'Remis';
      console.log('Gra skończona! Wygrał:', winner);
    }
  }
  
// 

// protected trackByPosition(index: number, card: Card): number {
//   return card.position || index;
// }

  // Helper do generowania URL obrazka
  getImageUrl(card: Card): string {
    return `http://localhost:3000${card.imagePath}`;
  }

  // NOWE FUNKCJE RESTART:
  
  // Sprawdź czy gra jest skończona
  protected isGameFinished(): boolean {
    return this.gamePhase() === 'finished' || 
           this.cards().length > 0 && this.cards().every(card => card.isMatched);
  }
  
  // Sprawdź czy są jeszcze karty do odkrycia
  protected hasUnmatchedCards(): boolean {
    return this.cards().some(card => !card.isMatched);
  }
  
  // ZAKTUALIZOWANA logika restart
  protected onRestartClick() {
    if (this.isGameFinished()) {
      // Gra skończona - restart od razu
      this.restartGame();
    } else if (this.hasNoMatchedCards()) {
      // Żadna para nie została odkryta - restart od razu
      this.restartGame();
    } else if (this.hasUnmatchedCards()) {
      // Niektóre pary odkryte, niektóre nie - zapytaj o potwierdzenie
      this.showRestartConfirm.set(true);
    }
  }
  
  // NOWA FUNKCJA - sprawdź czy żadna para nie została odkryta
  protected hasNoMatchedCards(): boolean {
    return this.cards().length > 0 && !this.cards().some(card => card.isMatched);
  }

  // Potwierdź restart
  protected confirmRestart() {
    this.showRestartConfirm.set(false);
    this.restartGame();
  }
  
  // Anuluj restart
  protected cancelRestart() {
    this.showRestartConfirm.set(false);
  }
  
  // Wykonaj restart
  protected restartGame() {
    console.log('🔄 Restarting game...');
    
    // Zresetuj wszystkie sygnały do stanu początkowego
    this.gamePhase.set('preview');
    this.previewTimeLeft.set(5);
    this.player1Score.set(0);
    this.player2Score.set(0);
    this.currentPlayer.set(0);
    this.flippedCards.set([]);
    this.showRestartConfirm.set(false);
    
    // Załaduj karty ponownie (nowe wymieszanie)
    this.loadCards();
  }
}
