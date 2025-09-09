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
  protected cards = signal<Card[]>([]);

  ngOnInit() {
    this.loadCards();
  }

  private async loadCards() {
    try {
      // Pobierz karty z backend API
      const response = await this.http.get<Card[]>('http://localhost:3000/api/cards').toPromise();
      if (response) {
        this.cards.set(response);
        console.log('Załadowane karty:', response);
      }
    } catch (error) {
      console.error('Błąd ładowania kart:', error);
    }
  }

  // Helper do generowania URL obrazka
  getImageUrl(card: Card): string {
    return `http://localhost:3000${card.imagePath}`;
  }
}
