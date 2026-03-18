import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  async getRooms() {
    return this.chatService.getRooms();
  }

  @Post('rooms')
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Body() body: { name: string; description?: string },
    @Req() req: { user: { userId: number; username: string } },
  ) {
    return this.chatService.createRoom(body.name, body.description);
  }

  @Get('rooms/:roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    // no pagination - returns all messages
    return this.chatService.getMessages(parseInt(roomId));
  }
}
