import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@users/entities/user.entity';
import { CreateUserDto } from '@users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ id: string; email: string; username: string }> {
    const { email, username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }]
    });

    if (existingUser) {
      throw new BadRequestException(
        existingUser.email === email
          ? 'Email already in use'
          : 'Username already in use'
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      username,
      passwordHash
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username
    };
  }

  private async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash') // i need this to validate the password, i disabled select false in the entity to ensure no get by mistake :))
      .where('user.email = :email', { email })
      .getOne();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async delete(): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute();
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
