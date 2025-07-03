// src/app/components/ticket-form/ticket-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import form modules
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { switchMap } from 'rxjs/operators'; // For chaining observables
import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  imports: [NgIf, CommonModule, ReactiveFormsModule, RouterModule], // Add NgIf here
  styleUrls: ['./ticket-form.component.css'],
  standalone: true // Mark component as standalone to use imports directly
})

export class TicketFormComponent implements OnInit {
  ticketForm!: FormGroup; // Use definite assignment assertion for non-null
  isEditMode: boolean = false;
  ticketId: string | null = null;
  pageTitle: string = 'Create New Ticket';

  // Dropdown options
  priorities: Array<Ticket['priority']> = ['Low', 'Medium', 'High', 'Urgent'];
  statuses: Array<Ticket['status']> = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  categories: Array<Ticket['category']> = ['Hardware', 'Software', 'Network', 'Other'];

  constructor(
    private fb: FormBuilder, // FormBuilder helps create form controls easily
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.initForm(); // Initialize the form structure

    this.route.paramMap.pipe(
      switchMap(params => {
        this.ticketId = params.get('id'); // Get the ID from the route
        this.isEditMode = !!this.ticketId; // Sset edit mode if ID exists

        if (this.isEditMode && this.ticketId) {
          this.pageTitle = 'Edit Ticket';
          return this.ticketService.getTicketById(this.ticketId); // Fetch ticket details for editing
        } else {
          this.pageTitle = 'Create New Ticket';
          return new Observable<undefined>(); // Return empty observable for create mode
        }
      })
    ).subscribe(
      ticket => {
        if (ticket) {
          // Patch the form with existing ticket data for editing
          this.ticketForm.patchValue({
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.category,
            assignedTo: ticket.assignedTo,
            submittedBy: ticket.submittedBy
            // Note: ID, createdAt, updatedAt, comments are not part of the form inputs
          });
        } else if (this.isEditMode) {
          console.warn('Ticket not found for editing, redirecting to create new.');
          this.router.navigate(['/tickets/new']); // Redirect to create new if ticket not found 
        }
      }, 
      error => {
        console.error('Error fetching ticket for editing:', error);
        this.router.navigate(['/tickets']); // Navigate away on error
      }
    );
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      // Define form controls and their initial values/validators
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Open', Validators.required],
      priority: ['Medium', Validators.required],
      category: [null], // Optional
      assignedTo: [null], // Optional
      submittedBy: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const formData: Partial<Ticket> = this.ticketForm.value; // Get form values

      if (this.isEditMode && this.ticketId) {
        // Update existing ticket
        const updatedTicket: Ticket = {
          id: this.ticketId, // Crucial to include ID for updates
          ...formData,
          createdAt: new Date(), // These will be overwritten by the service or backend
          updatedAt: new Date(),
          comments: [] // Comments handled separately, not via form
        } as Ticket; // Type assertion because we're manually adding ID and timestamps

        this.ticketService.updateTicket(updatedTicket).subscribe(
          response => {
            if (response) {
              console.log('Ticket updated successfully:', response);
              this.router.navigate(['/tickets', response.id]); // Navigate to detail view
            } else {
              console.error('Failed to update ticket (response was undefined.');
            }
          },
          error => {
            console.error('Error updating ticket:', error);
          }
        );
      } else {
        // Create new ticket
        // Omit properties handled by the service (id, createdAt, updatedAt, comments, status)
        const newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status'> = formData as any;

        this.ticketService.createTicket(newTicketData).subscribe(
          response => {
            console.log('Ticket created successfully:', response);
            this.router.navigate(['/tickets', response.id]); // Navigate to detail view
          },
          error => {
            console.error('Error creating ticket:', error);
          }
        );
      }
  } else {
    // Form is invalid, show validation errors (you'd typically add error message in the template)
    console.error('Form is invalid.');
    this.ticketForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
  }
}

goBackToList(): void {
  this.router.navigate(['/tickets']);
}
}

@NgModule({
  imports: [CommonModule],
})
export class TicketFormModule {}
