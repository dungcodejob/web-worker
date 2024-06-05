import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { combineLatest, startWith, tap } from 'rxjs';
import { BookFilter } from '../../models';
import { BookSearchFacade } from './book-search.facade';
type BookSearchForm = FormGroup<{
  book: FormControl<string | null>;
  searchTerm: FormControl<string>;
}>;

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.css',
  providers: [provideComponentStore(BookSearchFacade)],
})
export class BookSearchComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly facade = inject(BookSearchFacade);

  $filter = output<BookFilter>({ alias: 'filter' });

  vm$ = this.facade.vm$;

  form!: BookSearchForm;

  ngOnInit(): void {
    this.initialForm();
    this.listenFormValueChanges();
  }

  private initialForm() {
    this.form = this.fb.group<BookSearchForm['controls']>({
      book: this.fb.control(null),
      searchTerm: this.fb.control(''),
    });
  }

  private listenFormValueChanges() {
    const { book, searchTerm } = this.form.controls;

    const book$ = book.valueChanges.pipe(startWith(book.value));
    const searchTerm$ = searchTerm.valueChanges.pipe(
      startWith(searchTerm.value)
    );

    combineLatest({
      book: book$,
      searchTerm: searchTerm$,
    })
      .pipe(
        tap((data) => {
          this.$filter.emit(data);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
