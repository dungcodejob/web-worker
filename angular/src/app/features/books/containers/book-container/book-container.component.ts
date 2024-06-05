import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { BookSearchComponent } from '../../components/book-search/book-search.component';
import { BookFilter } from '../../models';
import { BookContainerFacade } from './book-container.facade';

@Component({
  selector: 'app-book-container',
  standalone: true,
  imports: [BookSearchComponent, AsyncPipe],
  providers: [provideComponentStore(BookContainerFacade)],
  templateUrl: './book-container.component.html',
  styleUrl: './book-container.component.css',
})
export class BookContainerComponent {
  private readonly _facade = inject(BookContainerFacade);

  vm$ = this._facade.vm$;
  onFilter(filter: BookFilter) {
    this._facade.filter(filter);
  }
}
