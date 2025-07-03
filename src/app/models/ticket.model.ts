// src/app/models/ticket.model.ts

export interface Ticket {
    id: string; // Unique identifier for the ticket
    title: string; // Title of the ticket
    description: string; // Detailed description of the ticket
    status: 'Open' | 'In Progress' | 'Closed' | 'Pending' | 'Resolved'; // Current status of the ticket
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'; // Priority level of the ticket
    category?: 'Hardware' | 'Software' | 'Network' | 'Other'; // Optional category for the ticket
    assignedTo?: string; // Optional field for the user assigned to the ticket
    submittedBy: string; // User who submitted the ticket
    createdAt: Date; // Timestamp when the ticket was created
    updatedAt: Date; // Timestamp when the ticket was last updated

    // Optional: array of comments/updates on the ticket
    
    comments?: {
        text: string; // Comment text
        user: string; // User who made the comment
        timestamp: Date; // Timestamp of the comment
    }[];
    }
