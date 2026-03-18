import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
) {}

  async register(dto: any) {
    if (dto.username.length < 3) {
      throw new BadRequestException('Username too short');
    }

    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async login(dto: any) {
    const user = await this.userRepository.findOne({ where: { username: dto.username } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.password !== dto.password) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}