import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { map } from 'rxjs';
import { BookChoice, BookInfo } from '../../models/book-info';
const books: Record<BookChoice, BookInfo> = {
  [BookChoice.AliceInWonderland]: {
    url: 'assets/books/alice.txt',
    name: 'Alice in Wonderland',
  },
  [BookChoice.SherlockHolmes]: {
    url: 'assets/books/sherlock.txt',
    name: 'Sherlock Holmes',
  },
  [BookChoice.WarAndPeace]: {
    url: 'assets/books/war-and-peace.txt',
    name: 'War and Peace',
  },
};

type BookSearchState = {
  books: Record<BookChoice, BookInfo>;
};

const initialState: BookSearchState = {
  books: books,
};

@Injectable()
export class BookSearchFacade extends ComponentStore<BookSearchState> {
  constructor() {
    super(initialState);
  }

  readonly books$ = this.select((state) => state.books).pipe(
    map((books) => Object.values(books))
  );

  vm$ = this.select(
    {
      books: this.books$,
    },
    { debounce: true }
  );
}
