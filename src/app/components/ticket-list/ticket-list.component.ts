import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // Import CommonModule for common directives
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { TicketService } from '../../services/ticket.service'; // Import TicketService for fetching tickets
import { Ticket } from '../../models/ticket.model'; // Adjust import path as necessary
import { Observable } from 'rxjs'; // Import Observable for handling asynchronous data

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  imports: [NgIf, CommonModule, RouterModule], // Add NgIf here
  standalone: true,
})
export class TicketListComponent implements OnInit {
  tickets$: Observable<Ticket[]> | undefined; // Observable to hold the list of tickets

  constructor(
    private ticketService: TicketService, // Inject TicketService to fetch tickets
    private router: Router // Inject Router for navigation
  ) { }

  ngOnInit(): void {
    this.getTickets(); // Fetch tickets when the component initializes
  }

  getTickets(): void {
    this.tickets$ = this.ticketService.getTickets(); // Call the service to get tickets
  }

  viewTicket(ticketId: string): void {
    this.router.navigate(['/tickets', ticketId]); // Navigate to the ticket details page
  }

  editTicket(id: string): void {
    this.router.navigate(['/tickets/edit', id]); // Navigate to the edit ticket page
  }

  deleteTicket(id: string): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(
        deleted => {
          if (deleted) {
            console.log(`Ticket ${id} deleted successfully`); // Log success message
            this.getTickets(); // Refresh the list after deletion
          } else {
            console.error(`Failed to delete ticket ${id}`); // Log error if deletion fails
        }
      }, 
      error => {
        console.error(`Error deleting ticket ${id}:`, error); // Log error if there's an issue with the request
      }
      );
    }
  }

  // Helper for styling based on priority
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'priority-urgent';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  // Helper for styling based on status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      case 'Pending': return 'status-pending';
      default:return '';
    }
  }
}
