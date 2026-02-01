import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id: number) {
    return this.repo.findOneBy({ id });
  }
}
