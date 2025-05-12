import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Message } from '../../model/message';
import { Conversation } from '../../model/conversation';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Urls } from 'src/app/url/url';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl: string = Urls.serverpath4;
  private userApiUrl = 'http://localhost:8089/Constructify/user';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();
  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiFilterUrl = 'http://localhost:5000/predict'; // URL of your Flask API



  // Method to send text content to Flask API for prediction
  getPrediction(content: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      content: content,
    };

    return this.http.post<any>(this.apiFilterUrl, body, { headers });
  }

  createConversation(
    creatorId: number,
    participants: number[],
    name?: string,
    isGroup: boolean = false,
    isPM: boolean = false
  ): Observable<Conversation> {
    let params = new HttpParams()
      .set('creatorId', creatorId.toString())
      .set('isGroup', isGroup.toString())
      .set('isPM', isPM.toString());

    participants.forEach(p => {
      params = params.append('participants', p.toString());
    });

    if (name) {
      params = params.set('name', name);
    }

    return this.http.post<Conversation>(`${this.apiUrl}/conversation`, null, { params });
  }



  // message.service.ts
  sendMessage(conversationId: number, content: string, mediaUrl?: string, isPM: boolean = false): Observable<Message> {
    const currentUserId = this.authService.getCurrentUser().id;

    const body = new HttpParams()
      .set('senderId', currentUserId.toString())
      .set('conversationId', conversationId.toString())
      .set('content', content)
      .set('isPM', isPM.toString())
      .set('mediaUrl', mediaUrl || '');

    // ✅ Debug: Console logs for all values
    console.log('Sending message with values:');
    console.log('senderId:', currentUserId);
    console.log('conversationId:', conversationId);
    console.log('content:', content);
    console.log('mediaUrl:', mediaUrl);
    console.log('isPM:', isPM);
    console.log('Serialized body:', body.toString());

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.http.post<Message>(
      `${this.apiUrl}/send`,
      body.toString(), // <-- important
      { headers }
    );
  }


    getMessagesByConversation(conversationId: number, userId: number): Observable<Message[]> {
      return this.http.get<Message[]>(`${this.apiUrl}/conversation/${conversationId}?userId=${userId}`)
        .pipe(
          tap(messages => {
            const filteredMessages = messages.filter(m => !m.isDeleted);
            this.messagesSubject.next(filteredMessages); // Always emit filtered messages
            console.log(messages)
          })
        );
    }


    Summarize(conversationId: number, userId: number): Observable<string> {
      return this.http.get<string>(`${this.apiUrl}/summarize/conversation/${conversationId}?userId=${userId}`)
    }


    // Method to retrieve a conversation by conversationId
  getConversationById(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/api/conversation/${conversationId}`);
  }

  // Method to retrieve all conversations for a user
  getAllConversationsForUser(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/user/${userId}`);
  }

  getConversationParticipants(conversationId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${conversationId}/participants`);
  }

  deleteMessage(messageId: number, userId: number): Observable<any> {
    // Immediately update UI before backend response
    const updatedMessages = this.messagesSubject.getValue().filter(m => m.messageId !== messageId);
    this.messagesSubject.next(updatedMessages);

    return this.http.delete(`${this.apiUrl}/${messageId}?userId=${userId}`).pipe(
      tap(() => {
        // Ensure deleted message does not reappear
        const filteredMessages = this.messagesSubject.getValue().filter(m => !m.isDeleted);
        this.messagesSubject.next(filteredMessages);
      })
    );
  }



  editMessage(messageId: number, userId: number, newContent: string): Observable<Message> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newContent', newContent);

    return this.http.put<Message>(`${this.apiUrl}/${messageId}/edit`, {}, { params });
  }



   pinMessage(messageId: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${messageId}/pin`, {});
}

unpinMessage(messageId: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${messageId}/unpin`, {});
}


updateConversationName(conversationId: number, newName: string): Observable<Conversation> {
  const params = new HttpParams().set('name', newName);
  return this.http.put<Conversation>(`${this.apiUrl}/conversation/${conversationId}`, {}, { params });
}


getAllUsers(page: number = 0, size: number = 50): Observable<any[]> {
  return this.http.get<{ content: any[] }>(`${this.userApiUrl}/all?page=${page}&size=${size}`)
    .pipe(
      // extract the 'content' array
      // if it's not paginated, you can remove this step
      tap(response => console.log('Users fetched from backend:', response)),
      // map to just the content
      map(response => response.content)
    );
}


getUserDetails(userId: number): Observable<any> {
  console.log('Fetching user with ID:', userId);
  return this.http.get(`${this.userApiUrl}/GetuserById/${userId}`);
}

searchUsers(prefix: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/suggestions?prefix=${prefix}`);
}

searchUsersByEmailPrefix(prefix: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Constructify/users/search`, {
    params: { prefix }
  });
}


// Add these methods to your MessageService class

markAsDelivered(messageId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/${messageId}/delivered`, {});
}

markAsRead(messageId: number, userId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/${messageId}/read`, null, {
    params: new HttpParams().set('userId', userId.toString())
  });
}

// Batch version for marking multiple messages as read
markMessagesAsRead(messageIds: number[], userId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/mark-read`, {
    messageIds,
    userId
  });
}

// ✅ Rename a conversation
renameConversation(conversationId: number, userId: number, newName: string): Observable<Conversation> {
  const params = new HttpParams()
    .set('userId', userId.toString())
    .set('newName', newName);
  return this.http.put<Conversation>(`${this.apiUrl}/conversation/${conversationId}/rename`, {}, { params });
}

// ✅ Delete a conversation
deleteConversation(conversationId: number, userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/conversation/${conversationId}?userId=${userId}`);
}


}
