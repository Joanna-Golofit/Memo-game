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
@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = signal('MEMO MIX');
  protected readonly cards = signal<Card[]>([]);
  protected readonly flippedCards = signal<Card[]>([]); 

    // NOWE SYGNAŁY:
    protected readonly gamePhase = signal<'preview' | 'playing' | 'finished'>('preview');
    protected readonly previewTimeLeft = signal<number>(5);
    protected readonly player1Score = signal<number>(0);
    protected readonly player2Score = signal<number>(0);
    protected readonly currentPlayer = signal<number>(0); // 0 = Inka, 1 = Lorena

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

  protected onCardClick(clickedCard: Card) {
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
    
    this.flippedCards.update(flipped => [...flipped, clickedCard]);
    
    if (this.flippedCards().length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  }
  
  private checkMatch() {
    const [first, second] = this.flippedCards();
    
    if (first.id === second.id) {
      // MATCH! - oznacz jako znalezione
      this.cards.update(cards =>
        cards.map(card =>
          card.position === first.position || card.position === second.position
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      // DODAJ PUNKT do aktualnego gracza
      if (this.currentPlayer() === 0) {
        this.player1Score.update(score => score + 1);
      } else {
        this.player2Score.update(score => score + 1);
      }
      
      console.log(`MATCH! ${first.name} - Gracz ${this.currentPlayer() + 1} zyskuje punkt!`);
      
      // Sprawdź czy gra się skończyła
      this.checkGameEnd();
    } else {
      // NO MATCH - odwróć z powrotem
      this.cards.update(cards =>
        cards.map(card =>
          card.position === first.position || card.position === second.position
            ? { ...card, isFlipped: false }
            : card
        )
      );
      
      // Zmień gracza
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
}
