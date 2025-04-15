import { Component } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent {
  isSidebarClosed = false;
  activeMenu: string | null = null;
  searchTerm: string = '';  // Holds the value of the search input

  // Method to toggle the sidebar
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  // Method to toggle submenu visibility
  toggleSubMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  // Method to handle search logic
  onSearch() {
    console.log("Searching for:", this.searchTerm);

    // Highlight or filter based on searchTerm
    // This method can be enhanced with the actual logic of your search (e.g., filtering a list or highlighting text)
    this.highlightSearchTerm(this.searchTerm);
  }

  // Function to highlight the search term in the content
  highlightSearchTerm(term: string) {
    this.clearHighlights();
    if (term.trim() === '') return;

    const regex = new RegExp(`(${term})`, 'gi');  // Case-insensitive regex
    const elements = document.querySelectorAll('.content *');  // Get all elements inside .content

    elements.forEach((element: Element) => {
      const el = element as HTMLElement;
      
      if (el.children.length === 0 && el.textContent) {
        const originalText = el.textContent;
        const highlightedText = originalText.replace(regex, `<mark>$1</mark>`);

        if (originalText !== highlightedText) {
          el.innerHTML = highlightedText;  // Update the element's content with highlighted text
        }
      }
    });
  }

  // Clear any previously highlighted search terms
  clearHighlights() {
    const markedElements = document.querySelectorAll('mark');
    markedElements.forEach((markedElement: Element) => {
      markedElement.replaceWith(markedElement.textContent || '');  // Remove <mark> tags and restore original content
    });
  }
 
}
