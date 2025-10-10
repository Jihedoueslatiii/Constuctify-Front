import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, AfterViewInit  } from '@angular/core';
import { MessageService } from '../../service/communication/message.service';
import { Router } from '@angular/router';
import { Message } from '../../model/message';
import { Conversation } from '../../model/conversation';
import { AuthService } from '../../service/auth/auth.service';
import { catchError, of, throwError } from 'rxjs';
import { MessageStatus } from '../../model/message-status';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrls: ['./list-messages.component.css']
})
export class ListMessagesComponent implements OnInit, AfterViewInit  {
  // Component State
  userConversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  users: any[] = [];
  filteredUsers: any[] = [];
  messages: Message[] = [];
  usersInConversation: number[] = [];

  summaryText: string = '';
  isDialogOpen: boolean = false;
  isSummarizing: boolean = false;

  // UI State
  newMessage: string = '';
  searchTerm: string = '';
  isEditing: boolean = false;
  editMode: boolean = false;
  isLoading: boolean = true;
  messageBeingEdited: Message | null = null;

  // Current User
  currentUserId: number | null = null;
  currentUser: any = null;

  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private zone: NgZone,
  ) {}





  private visibleMessages = new Set<number>();

// AfterViewInit implementation
ngAfterViewInit() {
  this.setupMessageObserver();
  setTimeout(() => {
    this.messages.forEach(msg => this.checkHateSpeech(msg.content));
  }, 0);
}




private setupMessageObserver() {
  const options = {
    root: this.messageContainer?.nativeElement,
    rootMargin: '0px',
    threshold: 0.8 // Increase threshold to ensure message is really visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const messageId = this.getMessageIdFromElement(entry.target);
        if (messageId) {
          this.markMessageAsReadIfNeeded(messageId);
        }
      }
    });
  }, options);

  // Observe messages after they're rendered
  this.cdr.detectChanges();
  setTimeout(() => {
    const messages = this.messageContainer?.nativeElement.querySelectorAll('.message-wrapper');
    messages?.forEach((msg: HTMLElement) => observer.observe(msg));
  }, 500);
}

private getMessageIdFromElement(element: Element): number | null {
  const messageId = element.getAttribute('data-message-id');
  return messageId ? parseInt(messageId) : null;
}

private markMessageAsReadIfNeeded(messageId: number) {
  const message = this.messages.find(m => m.messageId === messageId);
  if (message &&
      message.senderId !== this.currentUserId &&
      message.status !== 'READ') {
    this.messageService.markAsRead(messageId, this.currentUserId!).subscribe();
  }
}

// Call this when loading new messages to mark them as delivered
private markReceivedMessagesAsDelivered() {
  this.messages.forEach(message => {
    if (message.senderId !== this.currentUserId && message.status === 'SENT') {
      this.messageService.markAsDelivered(message.messageId).subscribe();
    }
  });
}
getConversationDisplayName(conversation: Conversation): string {
  if (!conversation || !conversation.participants) return 'Unknown';

  // If conversation has a custom name, use that
  if (conversation.name) {
    return conversation.name;
  }

  // For private conversations (2 participants)
  if (conversation.participants.length === 2) {
    const otherUserId = conversation.participants.find(id => id !== this.currentUserId);
    if (otherUserId) {
      const otherUser = this.users.find(u => u.id === otherUserId);
      return otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : 'Private Chat';
    }
  }

  // For group chats (3+ participants)
  return `Group (${conversation.participants.length})`;
}


getUnreadCount(conversation: Conversation): number {
  if (!conversation.messages) return 0;
  return conversation.messages.filter(m =>
    !m.isDeleted &&
    m.senderId !== this.currentUserId &&
    m.status !== MessageStatus.READ
  ).length;
}

ngOnInit(): void {
  this.currentUser = this.authService.getUserInfo();
  this.currentUserId = this.currentUser?.id; // Assign the ID here

  if (!this.currentUserId) {
    console.error('User ID not found, cannot load conversations.');
    this.router.navigate(['/login']);
    return;
  }
  this.loadAllUsers();
  this.markAllReceivedMessagesAsSeen();
}


markAllReceivedMessagesAsSeen() {
  // 1. Early return if no current user or messages
  if (!this.currentUserId || !this.messages?.length) return;

  // 2. Store in local variable to avoid repeated null checks
  const currentUserId = this.currentUserId;

  this.messages.forEach(message => {
    if (message.senderId !== currentUserId && message.status !== MessageStatus.READ) {
      message.status = MessageStatus.READ;

      // 3. Safe to use currentUserId here (TypeScript knows it's a number)
      this.messageService.markAsRead(message.messageId, currentUserId).subscribe();
    }
  });
}

  private initializeCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.currentUser?.id;

    if (!this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }
  }

  private loadAllUsers(): void {
    this.isLoading = true;
    this.messageService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.users = users.filter(user => user.id !== this.currentUserId);
        this.filteredUsers = [...this.users];
        this.loadConversations();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.isLoading = false;
      }
    });
  }

  private loadConversations(): void {
    this.messageService.getAllConversationsForUser(this.currentUserId!).subscribe({
      next: (conversations) => {
        this.userConversations = conversations;

        // Load participant details
        conversations.forEach(convo => {
          convo.participants?.forEach(participantId => {
            if (participantId !== this.currentUserId && !this.users.some(u => u.id === participantId)) {
              this.messageService.getUserDetails(participantId).subscribe({
                next: (user) => this.users.push(user)
              });
            }
          });
        });

        if (this.userConversations.length > 0) {
          this.selectConversation(this.userConversations[0]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load conversations:', err);
        this.isLoading = false;
      }
    });
  }

  summarizeConversation(): void {
    if (!this.selectedConversation || this.isSummarizing) return;

    this.isSummarizing = true;
    this.messageService.Summarize(this.selectedConversation.conversationId, this.currentUserId!)
      .pipe(
        catchError(error => {
          // If it's a parsing error but we got status 200, extract the text
          if (error.status === 200 && error.error.text) {
            return of(error.error.text);
          }
          // Otherwise rethrow the error
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (summary) => {
          this.summaryText = typeof summary === 'string' ? summary : JSON.stringify(summary);
          this.isDialogOpen = true;
          this.isSummarizing = false;
        },
        error: (err) => {
          console.error('Failed to summarize conversation:', err);
          this.isSummarizing = false;
        }
      });
  }

  get formattedSummaryText(): string {
    // Convert markdown-style bold text (** **) to HTML bold tags
    return this.summaryText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

  private loadParticipantsDetails(): void {
    const userIds = new Set<number>();
    this.userConversations.forEach(convo => {
      convo.messages?.forEach(msg => userIds.add(msg.senderId));
      convo.participants?.forEach(participantId => userIds.add(participantId));
    });
    this.fetchUserDetails(Array.from(userIds));
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.selectedConversation.messages = conversation.messages?.filter(m => !m.isDeleted) || [];
    this.messages = [...this.selectedConversation.messages]; // Create a new reference

    // Mark messages as delivered and read
    this.markReceivedMessagesAsDelivered();
    this.markAllMessagesAsSeen();

    this.messageService.getConversationParticipants(conversation.conversationId).subscribe({
      next: (userIds) => this.usersInConversation = userIds,
      error: (err) => console.error('Error fetching participants:', err)
    });

    setTimeout(() => this.scrollToBottom(), 100);
  }



  private markAllMessagesAsSeen(): void {
    if (!this.currentUserId || !this.selectedConversation) return;

    // Filter unread messages from other users
    const unreadMessages = this.selectedConversation.messages.filter(
      m => m.senderId !== this.currentUserId && m.status !== MessageStatus.READ
    );

    if (unreadMessages.length === 0) return;

    // Get message IDs for the API call
    const messageIds = unreadMessages.map(m => m.messageId);

    // Optimistically update UI
    unreadMessages.forEach(m => m.status = MessageStatus.READ);
    this.cdr.detectChanges();

    // Update backend
    this.messageService.markMessagesAsRead(messageIds, this.currentUserId).subscribe({
      error: (err) => {
        console.error('Failed to mark messages as read:', err);
        // Revert UI if API fails
        unreadMessages.forEach(m => m.status = MessageStatus.DELIVERED);
        this.cdr.detectChanges();
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  startPrivateConversation(otherUserId: number): void {
    const existingConversation = this.userConversations.find(convo =>
      convo.participants.includes(otherUserId) && convo.participants.length === 2
    );

    if (existingConversation) {
      this.selectConversation(existingConversation);
    } else {
      this.messageService.createConversation(
        this.currentUserId!,
        [this.currentUserId!, otherUserId],
        undefined,
        false,
        true
      ).subscribe({
        next: (conversation) => {
          const otherUser = this.users.find(user => user.id === otherUserId);
          conversation.name = otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : 'New Chat';
          this.userConversations.push(conversation);
          this.selectConversation(conversation);
        },
        error: (err) => {
          console.error("Error creating private conversation", err);
          alert("Could not create private conversation");
        }
      });
    }
  }
  sendMessage(content: string): void {
    console.log('Current User ID when sending:', this.currentUserId); // Add this line
    if (!this.selectedConversation || !content.trim()) return;

    const conversationId = this.selectedConversation.conversationId;

    // Step 1: Get Prediction to check for hate speech
    this.messageService.getPrediction(content).subscribe({
      next: (result) => {
        const isHateSpeech = result.isHateSpeech ? '1' : '0';

        // Step 2: Send the message with the isHateSpeech flag as a string
        this.messageService.sendMessage(conversationId, content, isHateSpeech).subscribe({
          next: () => {
            this.newMessage = '';
            this.refreshMessages();
            if (result.isHateSpeech) {
              console.warn('Message contains hate speech and has been sent.');
            }
          },
          error: (err) => console.error('Failed to send message:', err)
        });
      },
      error: (err) => {
        console.error('Prediction check failed:', err);
        this.messageService.sendMessage(conversationId, content, '0').subscribe({
          next: () => {
            this.newMessage = '';
            this.refreshMessages();
          },
          error: (sendErr) => console.error('Failed to send message after prediction error:', sendErr)
        });
      }
    });
  }


  editMessage(message: Message): void {
    if (message.senderId !== this.currentUserId) {
      console.error("You can only edit your own messages!");
      return;
    }

    this.editMode = true;
    this.messageBeingEdited = { ...message };
    this.newMessage = message.content;
  }

  saveEditedMessage(): void {
    if (!this.messageBeingEdited) return;

    this.messageService.editMessage(
      this.messageBeingEdited.messageId,
      this.currentUserId!,
      this.newMessage
    ).subscribe({
      next: (updatedMessage) => {
        if (this.selectedConversation) {
          this.selectedConversation.messages = this.selectedConversation.messages.map(msg =>
            msg.messageId === updatedMessage.messageId ? updatedMessage : msg
          );
        }
        // Update the main messages array as well
        this.messages = this.messages.map(msg =>
          msg.messageId === updatedMessage.messageId ? updatedMessage : msg
        );
        this.cancelEdit();
      },
      error: (err) => console.error('Failed to edit message:', err)
    });
  }
  cancelEdit(): void {
    this.editMode = false;
    this.messageBeingEdited = null;
    this.newMessage = '';
  }

  isDeleteMessageConfirmationOpen = false;
  messageToDelete: Message | null = null;

  // Open delete message modal
  openDeleteMessageModal(message: Message): void {
    this.messageToDelete = message;
    this.isDeleteMessageConfirmationOpen = true;
  }

  // Confirm deletion of message
  confirmDeleteMessage(): void {
    if (this.messageToDelete) {
      const message = this.messageToDelete;

      // Ensure the message is the sender's own message
      if (message.senderId !== this.currentUserId) {
        console.error("You can only delete your own messages!");
        this.closeDeleteMessageModal();
        return;
      }

      // Send the request to delete the message
      this.messageService.deleteMessage(message.messageId, this.currentUserId!).subscribe({
        next: () => {
          // Update local messages after successful deletion
          if (this.selectedConversation) {
            this.selectedConversation.messages = this.selectedConversation.messages.filter(
              m => m.messageId !== message.messageId
            );
          }

          // Also update the main messages array
          this.messages = this.messages.filter(m => m.messageId !== message.messageId);

          // Force Angular to update the UI
          this.cdr.detectChanges();

          // Close the modal after successful deletion
          this.closeDeleteMessageModal();
        },
        error: (err) => {
          console.error('Failed to delete message:', err);
          this.refreshMessages();
          this.closeDeleteMessageModal();

        }
      });
    }
  }


  // Cancel deletion
  cancelDeleteMessage(): void {
    this.closeDeleteMessageModal();
  }

  // Close the delete confirmation modal
  closeDeleteMessageModal(): void {
    this.isDeleteMessageConfirmationOpen = false;
    this.messageToDelete = null;
  }

  // Your existing delete icon click handler should now call openDeleteMessageModal
  deleteMessage(message: Message): void {
    this.openDeleteMessageModal(message); // Show the modal instead of directly deleting
  }
  togglePinMessage(message: Message): void {
    if (message.isPinned) {
      this.messageService.unpinMessage(message.messageId).subscribe({
        next: () => message.isPinned = false,
        error: (err) => console.error('Failed to unpin message:', err)
      });
    } else {
      this.messageService.pinMessage(message.messageId).subscribe({
        next: () => message.isPinned = true,
        error: (err) => console.error('Failed to pin message:', err)
      });
    }
  }

  editConversationName(): void {
    this.isEditing = true;
  }

  saveConversationName(): void {
    if (!this.selectedConversation) return;

    this.messageService.updateConversationName(
      this.selectedConversation.conversationId,
      this.selectedConversation.name
    ).subscribe({
      next: (updatedConversation) => {
        this.selectedConversation = updatedConversation;
        this.isEditing = false;
      },
      error: (err) => console.error("Error updating conversation name:", err)
    });
  }

  refreshMessages(): void {
    if (!this.selectedConversation) return;

    this.messageService.getMessagesByConversation(
      this.selectedConversation.conversationId,
      this.currentUserId!
    ).subscribe({
      next: (messages) => {
        console.log(messages)
        const filteredMessages = messages.filter(m => !m.isDeleted);
        this.messages = filteredMessages;
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        console.log(this.messages)
        /*this.summarizeService.summarizeConversation(this.messages).subscribe(
          (data)=>{
            console.log(data);
          }
        )*/
        if (this.selectedConversation) {
          this.selectedConversation.messages = filteredMessages;
        }
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Failed to refresh messages:', err)
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(user => user.id === userId) || this.currentUser;
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
  }

  getMessageClass(senderId: number): string {
    return senderId === this.currentUserId ? 'outgoing-message' : 'incoming-message';
  }

  isUserActive(userId: number): boolean {
    // Implement your actual user presence logic here
    return true;
  }

  private fetchUserDetails(userIds: number[]): void {
    userIds.forEach(id => {
      if (id !== this.currentUserId && !this.users.some(u => u.id === id)) {
        this.messageService.getUserDetails(id).subscribe({
          next: (user) => this.users.push(user),
          error: (err) => console.error('Failed to fetch user:', err)
        });
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        try {
          this.messageContainer.nativeElement.scrollTop =
            this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {
          console.error('Scrolling failed:', err);
        }
      }
    }, 100);
  }

  pinnedMessages() {
    return this.selectedConversation?.messages.filter(m => m.isPinned) || [];
  }

  unpinnedMessages() {
    return this.selectedConversation?.messages.filter(m => !m.isPinned) || [];
  }



   // Flag to control if the pinned messages dropdown is open or closed
   isPinnedMessagesDropdownOpen: boolean = false;

   // Method to toggle the state of the dropdown
   togglePinnedMessagesDropdown() {
     this.isPinnedMessagesDropdownOpen = !this.isPinnedMessagesDropdownOpen;
   }


   showEmojiPicker = false;

addEmoji(event: any) {
  this.newMessage += event.emoji.native;
}


isRenameDialogOpen: boolean = false;
conversationToRename: Conversation | null = null;
newConversationName: string = '';

triggerRenameConversation(event: MouseEvent, conversation: Conversation) {
  event.stopPropagation();
  this.conversationToRename = conversation;
  this.newConversationName = conversation.name || '';
  this.isRenameDialogOpen = true;
}

confirmRenameConversation() {
  if (this.conversationToRename && this.currentUserId !== null && this.newConversationName.trim()) {
    this.messageService.renameConversation(this.conversationToRename.conversationId, this.currentUserId, this.newConversationName.trim())
      .subscribe(updated => {
        this.conversationToRename!.name = updated.name;
        // Update in the userConversations array as well
        this.userConversations = this.userConversations.map(convo =>
          convo.conversationId === updated.conversationId ? updated : convo
        );
        if (this.selectedConversation?.conversationId === updated.conversationId) {
          this.selectedConversation.name = updated.name;
        }
        this.closeRenameDialog();
      });
  }
}

cancelRenameConversation() {
  this.closeRenameDialog();
}

closeRenameDialog() {
  this.isRenameDialogOpen = false;
  this.conversationToRename = null;
  this.newConversationName = '';
}


isDeleteConfirmationOpen: boolean = false;
conversationToDelete: Conversation | null = null;

triggerDeleteConversation(event: MouseEvent, conversation: Conversation) {
  event.stopPropagation();
  this.conversationToDelete = conversation;
  this.isDeleteConfirmationOpen = true;
}

confirmDeleteConversation() {
  if (this.conversationToDelete && this.currentUserId !== null) {
    this.messageService.deleteConversation(this.conversationToDelete.conversationId, this.currentUserId)
      .subscribe(() => {
        this.userConversations = this.userConversations.filter(c => c.conversationId !== this.conversationToDelete!.conversationId);
        if (this.selectedConversation?.conversationId === this.conversationToDelete!.conversationId) {
          this.selectedConversation = null;
        }
        this.closeDeleteConfirmation();
      });
  }
}

cancelDeleteConversation() {
  this.closeDeleteConfirmation();
}

closeDeleteConfirmation() {
  this.isDeleteConfirmationOpen = false;
  this.conversationToDelete = null;
}

 // Method to check hate speech for a message
 checkHateSpeech(content: string) {
  this.messageService.getPrediction(content).subscribe(
    (predictionResponse) => {
      // Assuming predictionResponse contains a boolean indicating if it's hate speech
      console.log('Prediction Response: ', predictionResponse);

      // Find the message and update its status
      const message = this.messages.find(msg => msg.content === content);
      if (message) {
        message.isHateSpeech = predictionResponse.isHateSpeech;

        // Get the message element (adjust selector based on how messages are rendered)
        const messageElement = document.querySelector(`.message[data-content="${content}"]`);

        if (messageElement) {
          if (message.isHateSpeech) {
            messageElement.classList.add('hate-speech'); // Add the hate-speech class if detected
          } else {
            messageElement.classList.remove('hate-speech'); // Remove the hate-speech class if not detected
          }
        }
      }
    },
    (error) => {
      console.error('Error getting prediction:', error);
    }
  );
}

}
