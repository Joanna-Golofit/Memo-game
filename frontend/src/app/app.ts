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

  // NOWE: Dodaj sygnały dla kategorii
  selectedCategory = signal<string>('all'); // 'all', 'animals', 'people', 'objects', 'colors'
  availableCategories = signal([
    { id: 'all', name: 'Wszystkie', icon: '🎲' },
    { id: 'default', name: 'Domyślne', icon: '🎯' },  // ← DODANA KATEGORIA
    { id: 'animals', name: 'Zwierzęta', icon: '🐱' },
    { id: 'people', name: 'Ludzie', icon: '👨‍👩‍👧‍👦' },
    { id: 'objects', name: 'Przedmioty', icon: '🧁' },
    { id: 'colors', name: 'Kolory', icon: '🌈' }
  ]);

  // NOWE: Sygnały dla imion graczy
  protected readonly player1Name = signal<string>('Inka');
  protected readonly player2Name = signal<string>('Natan');
  protected readonly isEditingPlayer1 = signal<boolean>(false);
  protected readonly isEditingPlayer2 = signal<boolean>(false);

  ngOnInit() {
    // Wczytaj zapisane imiona
    const savedPlayer1 = localStorage.getItem('player1Name');
    const savedPlayer2 = localStorage.getItem('player2Name');
    
    if (savedPlayer1) this.player1Name.set(savedPlayer1);
    if (savedPlayer2) this.player2Name.set(savedPlayer2);
    
    this.loadCards();
  }

  // ZMODYFIKOWANA: loadCards z parametrem kategorii
  private async loadCards(category: string = 'all') {
    try {
      let url = 'http://localhost:3000/api/cards';
      
      // Wybierz odpowiedni endpoint
      if (category === 'all') {
        url = 'http://localhost:3000/api/cards/random/8'; // To JUŻ zwraca 16 kart (8 par)!
      } else {
        url = `http://localhost:3000/api/cards/category/${category}`;
      }

      const response = await this.http.get<Card[]>(url).toPromise();
      if (response) {
        let cardsToUse = response;
        
        // POPRAWKA: endpoint /random/8 już zwraca gotowe pary!
        if (category === 'all') {
          // Dla 'all' nie dubluj - backend już zwraca 16 kart
          cardsToUse = response;
        } else {
          // Dla kategorii - stwórz pary ręcznie
          const maxCards = Math.min(cardsToUse.length, 8);
          cardsToUse = this.shuffleArray([...cardsToUse]).slice(0, maxCards);
          
          // Stwórz pary
          const pairs = [...cardsToUse, ...cardsToUse];
          cardsToUse = this.shuffleArray(pairs);
          
          // Dodaj pozycje i stan
          cardsToUse = cardsToUse.map((card, index) => ({
            ...card,
            position: index,
            isFlipped: false,
            isMatched: false
          }));
        }

        this.cards.set(cardsToUse);
        this.startPreview();
      }
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
      const winner = this.player1Score() > this.player2Score() ? this.player1Name() : 
                    this.player2Score() > this.player1Score() ? this.player2Name() : 'Remis';
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

  // NOWA: Zmiana kategorii
  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.loadCards(category);
    this.resetGame(); // Reset gry przy zmianie kategorii
  }

  private resetGame() {
    this.gamePhase.set('preview');
    this.player1Score.set(0);
    this.player2Score.set(0);
    this.currentPlayer.set(1);
    this.previewTimeLeft.set(5);
  }

  // NOWE FUNKCJE: Edycja imion
  protected startEditingPlayer1() {
    this.isEditingPlayer1.set(true);
  }

  protected startEditingPlayer2() {
    this.isEditingPlayer2.set(true);
  }

  protected savePlayer1Name(event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value.trim();
    if (newName && newName.length <= 12) {
      this.player1Name.set(newName);
      localStorage.setItem('player1Name', newName); // ← ZAPISZ
    }
    this.isEditingPlayer1.set(false);
  }

  protected savePlayer2Name(event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value.trim();
    if (newName && newName.length <= 12) {
      this.player2Name.set(newName);
      localStorage.setItem('player2Name', newName); // ← ZAPISZ
    }
    this.isEditingPlayer2.set(false);
  }

  protected cancelEditingPlayer1() {
    this.isEditingPlayer1.set(false);
  }

  protected cancelEditingPlayer2() {
    this.isEditingPlayer2.set(false);
  }
}
