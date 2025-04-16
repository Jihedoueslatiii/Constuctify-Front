import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
})
export class TagEditorComponent {
  availableTags: string[] = [];
  selectedTags: string[] = [];
  newTag = '';

  constructor(
    public dialogRef: MatDialogRef<TagEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: any }
  ) {
    // Initialize with existing tags if available
    if (this.data.report.tags) {
      this.selectedTags = [...this.data.report.tags];
    }
  }

  // Toggle tag selection
  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  // Add new tag from input
  addNewTag(): void {
    const tag = this.newTag.trim();
    if (tag && !this.availableTags.includes(tag)) {
      this.availableTags.push(tag);
      this.selectedTags.push(tag);
      this.newTag = '';
    }
  }

  // Remove tag (used by removable chips)
  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  // Save and close dialog
  save(): void {
    this.dialogRef.close(this.selectedTags);
  }

  // Cancel and close dialog
  cancel(): void {
    this.dialogRef.close();
  }
}