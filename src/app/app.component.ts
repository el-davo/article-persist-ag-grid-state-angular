import { Component, inject, OnInit, viewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { LoadGridStateDirective } from './directives/load-grid-state.directive';
import { PersistGridStateDirective } from './directives/persist-grid-state.directive';
import { GridService } from './services/grid-service';

@Component({
  selector: 'app-root',
  imports: [AgGridAngular, PersistGridStateDirective, LoadGridStateDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  badGrid = viewChild<AgGridAngular>('badGrid');
  title = 'article-persist-ag-grid-state-angular';
  gridService = inject(GridService);

  colDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
  ];

  data = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 },
  ];

  ngOnInit() {
    this.gridService.getGridState('my-grid-1').subscribe(() => {
      this.badGrid()?.api.applyColumnState({
        state: [
          {
            colId: 'price',
            width: 200,
          },
          {
            colId: 'make',
            width: 200,
          },
          {
            colId: 'model',
            width: 200,
          },
        ],
        applyOrder: true,
      });
    });
  }
}
