// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components for routing
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
// If you added a DashboardComponent or LoginComponent, import them too
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    // Default route to redirect to the ticket list
    { path : '', redirectTo: '/tickets', pathMatch: 'full' },

    // Route for displaying all tickets
    { path: 'tickets', component: TicketListComponent },
    
    // Route for creating a new ticket
    { path: 'tickets/new', component: TicketFormComponent },

    // Route for editing an existing ticket (e.g. using a ticket ID)
    { path: 'tickets/edit/:id', component: TicketFormComponent },

    // Route for viewing ticket details
    { path: '**', redirectTo: '/tickets' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }