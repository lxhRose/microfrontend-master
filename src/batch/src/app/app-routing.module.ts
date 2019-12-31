import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { APP_BASE_HREF } from '@angular/common';
import { VitalSignsComponent } from "./pages/vital-signs/vital-signs.component";

const routes: Routes = [
  { path: '', redirectTo: '/vitalSigns', pathMatch: 'full' },
  { path: 'vitalSigns', component: VitalSignsComponent },
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/batch' },
  ],
})
export class AppRoutingModule { }
