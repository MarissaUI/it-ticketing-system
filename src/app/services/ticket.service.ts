// src/app/services/ticket.service.ts

import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model'; // Adjust the import path as necessary
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private tickets: Ticket[] = []; // In-memory ticket storage
  // Counter for generating unique ticket IDs
  private nextId: number = 1;

  constructor() {
    // Initialize with some dummy data (optional)
    this.initializeDummyData();
  }

  private initializeDummyData(): void {
    this.tickets = [
      {
        id: this.generateId(),
        title: 'Network Connectivity Issue',
        description: 'Cannot access network drives or internet on workstation ABC-123.',
        status: 'Open',
        priority: 'High',
        category: 'Network',
        assignedTo: 'Marissa Chapman',
        submittedBy: 'John Doe',
        createdAt: new Date('2025-06-28T09:30:00Z'),
        updatedAt: new Date('2025-06-28T09:30:00Z'),
        comments: [{
          text: 'Checked cable, seems fine.',
          user: 'IT Support',
          timestamp: new Date('2025-06-28T10:00:00Z')
        }]
      },
      {
        id: this.generateId(),
        title: 'Software Installation Request',
        description: 'Need Adobe Photoshop installed on all design team computers.',
        status: 'Pending',
        priority: 'Medium',
        category: 'Software',
        assignedTo: 'Mary Sue',
        submittedBy: 'Jane Smith',
        createdAt: new Date('2025-06-27T14:15:00Z'),
        updatedAt: new Date('2025-06-27T14:15:00Z'),
        comments: [{
          text: 'Request license approval.',
          user: 'Jane Smith',
          timestamp: new Date('2025-06-27T14:20:00Z')
        }]
      },
      {
        id: this.generateId(),
        title: 'Monitor Flickering',
        description: 'My monitor keeps flickering randomly. Tried restarting but no change.',
        status: 'In Progress',
        priority: 'Low',
        category: 'Hardware',
        assignedTo: 'Bob White',
        submittedBy: 'Alice Johnson',
        createdAt: new Date('2025-06-26T11:45:00Z'),
        updatedAt: new Date('2025-06-26T11:45:00Z'),
        comments: [{
            text: 'Scheduled onsite visit for tomorrow morning.',
            user: 'Bob White',
            timestamp: new Date('2025-06-26T12:00:00Z')
          }] 
      },
      {
        id: this.generateId(),
        title: 'Password Reset',
        description: 'Forgot my password for the HR portal.',
        status: 'Closed',
        priority: 'Urgent',
        category: 'Other',
        assignedTo: 'IT Helpdesk',
        submittedBy: 'Sarah Connor',
        createdAt: new Date('2025-06-25T08:00:00Z'),
        updatedAt: new Date('2025-06-25T08:30:00Z'),
        comments: [{
          text: 'Password reset successfully. Please check your email.',
          user: 'IT Helpdesk',
          timestamp: new Date('2025-06-25T08:15:00Z')
        }]
      }
    ];
  }
   // Helper to generate unique IDs for in-memory tickets
  private generateId(): string {
    return `TKT-${String(this.nextId++).padStart(3, '0')}`;
  }
  // Return all tickets as an observable
  getTickets(): Observable<Ticket[]> {
    return of([...this.tickets]);
  }

  // Return a single ticket by ID as an observable
  getTicketById(id: string): Observable<Ticket | undefined> {
    const ticket = this.tickets.find(t => t.id === id);
    return of(ticket); // Returns undefined if not found
  }

  // Creates a new ticket
  // Omit ID, createdAt, updatedAt, comments, and status as they are set by the service
  createTicket(newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status'>): Observable<Ticket> {
    const now = new Date();
    const createdTicket: Ticket = {
      ...newTicketData, // Spread the new ticket data
      id: this.generateId(), // Generate a new ID
      status: 'Open', // Default status
      createdAt: now, // Set created date
      updatedAt: now, // Set updated date
      comments: [] // Initialize with empty comments
    };
    this.tickets.push(createdTicket); // Add to in-memory storage
    return of (createdTicket); // Return the created ticket as an observable
  }

  // Updates an existing ticket
  updateTicket(updatedTicket: Ticket): Observable<Ticket | undefined> {
    const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
    if (index > -1) {
      // Update timestamp for any modification
      updatedTicket.updatedAt = new Date();
      // Ensure comments array exists, then merge
      // This merge handles cases where updatedTicket might not provide all original fields.
      this.tickets[index] = {
        ...this.tickets[index], // Keep existing fields
        ...updatedTicket, // Overwrite with updated fields
        comments: updatedTicket.comments || this.tickets[index].comments // Preserve existing comments if not provided
      };
     return of(this.tickets[index]); // Return the updated ticket
  }
  return of(undefined); // Return undefined if ticket not found
}

// Deletes a ticket by ID
deleteTicket(id: string): Observable<boolean> {
  const initialLength = this.tickets.length;
  this.tickets = this.tickets.filter(t => t.id !== id);
  return of(this.tickets.length < initialLength); // Return true if ticket was deleted
}

// Adds a comment to a ticket
addComment(ticketId: string, commentText: string, username: string): Observable<Ticket | undefined> {
  const ticket = this.tickets.find(t => t.id === ticketId);
  if (ticket) {
    if (!ticket.comments) {
      ticket.comments = []; // Initialize if comment array is null/undefined
    }
    ticket.comments.push({
      text: commentText,
      user: username,
      timestamp: new Date()
    });
    ticket.updatedAt = new Date(); // Update the ticket's updatedAt timestamp
    return of(ticket);
  }
  return of(undefined);
 }
}
// ...other methods to manage tickets (add, update, delete, etc.)

