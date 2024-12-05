import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GridService {
  getGridState(gridName: string): Observable<any> {
    return timer(2000).pipe(
      switchMap(() =>
        of({
          state:
            '{"columnOrder":{"orderedColIds":["price","make","model"]},"columnSizing":{"columnSizingModel":[{"colId":"make","width":300}]}}',
        })
      )
    );
  }

  saveGridPreferences(
    gridName: string,
    gridState: string
  ): Observable<{ gridName: string; gridState: string }> {
    return timer(1000).pipe(() => of({ gridName, gridState }));
  }
}
