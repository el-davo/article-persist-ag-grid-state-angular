import {
  Directive,
  effect,
  inject,
  Input,
  input,
  model,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GridService } from '../services/grid-service';

@Directive({
  selector: '[appLoadGridState]',
  standalone: true,
})
export class LoadGridStateDirective {
  gridService = inject(GridService);
  templateRef = inject(TemplateRef);
  viewContainer = inject(ViewContainerRef);
  state = model<Record<string, string | number> | string>();
  persistGridAutoSize = input<boolean>(false);
  name = model<string>();

  @Input() set loadGridStateName(name: string) {
    this.name.set(name);
  }

  constructor() {
    effect(async () => {
      this.viewContainer.clear(); // <- Make sure to clear the view first otherwise you could accidentally end up rendering multiple grid :)

      const gridPreferences$ = this.gridService.getGridState(
        this.name() ?? 'default-grid'
      ); // <- Here we retrieve the stored state of the grid from the backend

      try {
        // <- Handle errors while making the network request
        const gridPreferences = await lastValueFrom(gridPreferences$);
        const initialState = JSON.parse(gridPreferences.state || '{}');

        this.viewContainer.createEmbeddedView(this.templateRef, {
          initialState,
        }); // Render the grid while passing the initial state to the template
      } catch (error) {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          initialState: {},
        });
      }
    });
  }
}
