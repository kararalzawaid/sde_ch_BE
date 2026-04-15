import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@users/entities/user.entity';
import { Message } from '@messages/entities/message.entity';

import { GetMessagesQueryDto } from '@messages/dto/get-messages-query.dto';
import { CreateOrUpdateMessageDto } from '@messages/dto/create-or-update-message.dto';

import { getStartIndex } from '@common/helpers/pagination';

const MESSAGE_CREATED_EVENT = 'message.created';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createMessageDto: CreateOrUpdateMessageDto, userId: string): Promise<Message> {
    const message = this.messagesRepository.create(createMessageDto);

    message.user = { id: userId } as User;

    const savedMessage = await this.messagesRepository.save(message);
    // this is for the bonus, i saw that you need logs service to log the message created event
    // (include suggestions for observability and monitoring)
    // i decoupled the code from the main functionality cause we don;t want to effect the user experience
    this.eventEmitter.emit(MESSAGE_CREATED_EVENT, { messageId: savedMessage.id, userId, tag: savedMessage.tag });

    return savedMessage;
  }

  async findAll(getMessagesQueryDto: GetMessagesQueryDto): Promise<{ count: number, messages: Message[] }> {
    const [messages, count] = await this.createMessagesQb(getMessagesQueryDto).getManyAndCount();

    return {
      count,
      messages
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    // left join with users table to get the user id
    const message = await this.messagesRepository.findOne({ where: { id }, relations: ['user'] });

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    if (message.user.id !== userId) {
      throw new BadRequestException('You are not allowed to delete this message');
    }

    await this.messagesRepository.delete({ id: message.id });
  }

  async update(id: string, userId: string, updateMessageDto: CreateOrUpdateMessageDto): Promise<void> {
    const message = await this.messagesRepository.findOne({ where: { id }, relations: ['user'] });

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    if (message.user.id !== userId) {
      throw new BadRequestException('You are not allowed to update this message');
    }

    await this.messagesRepository.update({ id: message.id }, updateMessageDto);
  }

  async findOne(id: string): Promise<any> {
    // i need to return message without senstive data like password, password hash, password recovery hash, password recovery expires
    // select id, tag, text, user.id, user.email, user.username from messages left join users on messages.user_id = users.id where messages.id = :id
    // however to ensure no mistakes i made the password hash and password recovery hash and password recovery expires select false

    return this.messagesRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .select([
        'message.id',
        'message.tag',
        'message.text',
        'user.id',
        'user.email',
        'user.username'
      ])
      .where('message.id = :id', { id })
      .getOne();
  }

  private createMessagesQb(getMessagesQueryDto: GetMessagesQueryDto): SelectQueryBuilder<Message> {
    const {
      page = 1,
      limit = 10,
      tag,
      startDate,
      endDate,
      userId
    } = getMessagesQueryDto;

    const offset = getStartIndex(page, limit);

    // i need to return message without senstive data like password, password hash, password recovery hash, password recovery expires
    // select id, tag, text, user.id, user.email, user.username from messages inner join users on messages.user_id = users.id;
    // however to ensure no mistakes i made the password hash and password recovery hash and password recovery expires select false
    const qb = this.messagesRepository.createQueryBuilder('message')
      .take(limit)
      .skip(offset)
      .leftJoinAndSelect('message.user', 'user')
      .select([
        'message.id',
        'message.tag',
        'message.text',
        'message.createdAt',
        'user.id',
        'user.email',
        'user.username'
      ]);

    if (tag) {
      qb.where('message.tag = :tag', { tag });
    }

    if (startDate) {
      qb.where('message.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('message.createdAt <= :endDate', { endDate });
    }

    if (userId) {
      qb.where('message.userId = :userId', { userId });
    }

    return qb;
  }
}
