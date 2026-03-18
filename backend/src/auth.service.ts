import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';

const JWT_SECRET = 'supersecret'; // TODO: move to env

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<any> {
    console.log('Registering user:', username);
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = this.userRepository.create({ username, password: hashed });
    const saved = await this.userRepository.save(user);
    const token = jwt.sign({ userId: saved.id, username }, JWT_SECRET, { expiresIn: '24h' });
    return { token, userId: saved.id };
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    console.log('User logged in:', username);
    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '24h' });
    return { token, userId: user.id };
  }

  // async refreshToken(token: string) {
  //   // TODO: implement refresh tokens
  //   return null;
  // }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}
