import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { auditTime, filter, switchMap, tap } from 'rxjs';
import { BookApi } from '../../data-access';
import { BookFilter } from '../../models';
import { SearchResult, getAccumulatedSearchResults } from '../../utils';

type BookContainerState = SearchResult;

const initialState: BookContainerState = {
  paragraphs: [],
  paragraphCount: 0,
  searchedParagraphCount: 0,
};

@Injectable()
export class BookContainerFacade extends ComponentStore<BookContainerState> {
  private readonly bookApi = inject(BookApi);
  constructor() {
    super(initialState);
  }
  readonly paragraphs$ = this.select((state) => state.paragraphs);
  readonly paragraphCount$ = this.select((state) => state.paragraphCount);
  readonly searchedParagraphCount$ = this.select(
    (state) => state.searchedParagraphCount
  );
  readonly progress$ = this.select(
    this.select((state) => state.paragraphCount),
    this.select((state) => state.searchedParagraphCount),
    (paragraphCount, searchedParagraphCount) => {
      if (paragraphCount === 0) {
        return 0;
      }
      return Math.round((searchedParagraphCount / paragraphCount) * 100);
    }
  );

  vm$ = this.select(
    {
      paragraphs: this.paragraphs$,
      paragraphCount: this.paragraphCount$,
      searchedParagraphCount: this.searchedParagraphCount$,
      progress: this.progress$,
    },
    { debounce: true }
  );

  filter = this.effect<BookFilter>((filter$) => {
    return filter$.pipe(
      filter((filter) => filter.book !== null),
      switchMap(({ book, searchTerm }) => {
        return this.bookApi.getBook(book as string).pipe(
          switchMap((text) => getAccumulatedSearchResults(searchTerm, text)),
          auditTime(1000 / 60),
          tap((result) => {
            console.log(result);
            this.patchState(result);
          })
        );
      })
    );
  });
}
