import { DestroyRef, Directive, HostListener, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { debounceTime, mergeMap, Subject } from 'rxjs';
import { GridService } from '../services/grid-service';

@Directive({
  selector: '[appPersistGridState]',
  standalone: true
})
export class PersistGridStateDirective {
  grid = inject(AgGridAngular);
  gridService = inject(GridService);
  destroyedRef = inject(DestroyRef);
  persistGridState = input<Record<string, string | number> | string>();
  saveState$ = new Subject<void>();

  @HostListener('gridReady')
  gridReady() {
    this.saveState$
      .pipe(
        debounceTime(500),   // <- Add a debounce to prevent overloading the backend
        takeUntilDestroyed(this.destroyedRef),
        mergeMap(() => {
          const { columnOrder, columnSizing, columnVisibility, sort } = this.grid.api.getState(); // <- Get the state of the grid

          return this.gridService.saveGridPreferences( // <- Store the grid state to the backend as a base64 string
            this.grid.context.name, // <- Give the grid a name so we can look up the state later
            JSON.stringify({ columnOrder, columnSizing, columnVisibility, sort })
          );
        })
      )
      .subscribe();
  }

  @HostListener('displayedColumnsChanged')
  @HostListener('columnResized')
  @HostListener('sortChanged')
  saveGridState() {
    this.saveState$.next();
  }
}