import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BattlesComponent } from './game/battles.component';

const routes: Routes = [
  { path: 'battles', component: BattlesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
