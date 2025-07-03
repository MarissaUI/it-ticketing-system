// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketListComponent }, // <-- Is TicketListComponent correctly imported and referenced?
  { path: 'tickets/new', component: TicketFormComponent },
  { path: 'tickets/edit/:id', component: TicketFormComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  { path: '**', redirectTo: '/tickets' }
];
