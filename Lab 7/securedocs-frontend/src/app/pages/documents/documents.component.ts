import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  error = '';
  lastVisited: any = null; // ⭐ NEW

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadDocuments();
    await this.loadLastVisited(); // ⭐ NEW
  }

  async loadDocuments(): Promise<void> {
    try {
      this.documents = await this.documentService.getAll();
    } catch (err: any) {
      this.error = err?.error?.message || 'Failed to load documents';
    }
  }

  async loadLastVisited(): Promise<void> {
    try {
      this.lastVisited = await this.documentService.getLastVisited();
    } catch (err) {
      console.log('No last visited document');
    }
  }

  editDocument(id: string): void {
    this.router.navigate(['/documents/edit', id]);
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.documentService.delete(id);
      await this.loadDocuments();
    } catch (err: any) {
      this.error = err?.error?.message || 'Failed to delete document';
    }
  }
}