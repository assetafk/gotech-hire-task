import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    private messages = [];
    
    saveMessage(msg: any) {
        this.messages.push(msg);
        return msg;
    }
    getMessages() {
        return this.messages;
    }
}