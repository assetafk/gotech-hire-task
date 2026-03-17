import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [];

    create(dto: any) {
        const user = {
            id: Date.now(),
            username: dto.username,
            password: dto.password,
        }
        this.users.push(user);
        return user;
    }
    findAll() {
        return this.users.map(u => ({
            id: u.id,
            username: u.username,
        }));
    }
    findByUsername(username: string) {
        return this.users.find(u => u.username === username);
    }
}