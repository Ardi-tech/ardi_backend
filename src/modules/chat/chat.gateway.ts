import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinRoomSuccess', room);
    client.to(room).emit('userJoined', client.id);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.to(room).emit('userLeft', client.id);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    client: Socket,
    payload: { room: string; message: string },
  ): void {
    client
      .to(payload.room)
      .emit('newMessage', { userId: client.id, message: payload.message });
  }
}
