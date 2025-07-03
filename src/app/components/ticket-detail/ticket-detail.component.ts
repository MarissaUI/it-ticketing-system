// src/app/components/ticket-detail/ticket-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
  imports: [NgIf, CommonModule, FormsModule], // Add NgIf here
  standalone: true,
})

export class TicketDetailComponent implements OnInit {
  ticket$: Observable<Ticket | undefined> | undefined;
  newComment: string = '';
  currentUser: string = 'Current User'; // Placeholder for current user

  constructor(
    private route: ActivatedRoute, // To get route parameters
    private router: Router, // To navigate programmatically
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.ticket$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id'); // Get the ticket ID from the route parameters
        if (id) {
          return this.ticketService.getTicketById(id);
        } else {
          this.router.navigate(['/tickets']); //Redirect if no ID is found
          return new Observable<undefined>();
        }
      })
    );
  }

  addComment(ticketId: string | undefined): void {
    if (ticketId && this.newComment.trim()) {
      this.ticketService.addComment(ticketId, this.newComment.trim(), this.currentUser).subscribe(
        updatedTicket => {
          if (updatedTicket) {
            this.newComment = ''; // Clear the input field after adding the comment
            // Re-fetch or update the observable if necessary
            this.ticket$ = this.ticketService.getTicketById(ticketId); // Re-fetch to update view
          } else {
            console.error('Failed to add comment: Ticket not found or update failed.');
          }
        },
        error => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }
  goToEdit(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/tickets/edit', id]);
    }
  }

  goBackToList(): void {
    this.router.navigate(['/tickets']);
  }
}

@NgModule({
  imports: [CommonModule],
})
export class TicketDetailModule {}
