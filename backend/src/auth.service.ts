import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<any> {
    console.log('Registering user:', username);
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = this.userRepository.create({ username, password: hashed });
    const saved = await this.userRepository.save(user);
    const token = this.jwtService.sign({ userId: saved.id, username }, { expiresIn: '24h' });
    return { token, userId: saved.id };
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    console.log('User logged in:', username);
    const token = this.jwtService.sign({ userId: user.id, username }, { expiresIn: '24h' });
    return { token, userId: user.id };
  }

  verifyToken(token: string): { userId: number; username: string } | null {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  /** Returns users without sensitive fields (no password). */
  getPublicUsers(): Promise<Pick<User, 'id' | 'username' | 'createdAt'>[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'createdAt'],
    });
  }
}
