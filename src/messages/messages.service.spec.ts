import { MessagesService } from './messages.service';
import { BadRequestException } from '@nestjs/common';

describe('MessagesService', () => {
  describe('delete', () => {
    it('delete message when requester id matches owner id', async () => {
      const messageId = 'message-1';
      const ownerId = 'owner-1';

      const messageInDb = jest.fn().mockResolvedValue({
        id: messageId,
        user: { id: ownerId },
      });
      const deleteMock = jest.fn().mockResolvedValue(undefined);

      const mockRepository = {
        findOne: messageInDb,
        delete: deleteMock,
      };

      const service = new MessagesService(
        mockRepository as any,
        { emit: jest.fn() } as any,
      );

      await expect(service.delete(messageId, ownerId)).resolves.toBeUndefined();
      expect(deleteMock).toHaveBeenCalledWith({ id: messageId });
    });
  });

  it('throws if requester id is different from message owner id', async () => {
    const messageId = 'message-1';
    const userId = 'user1';

    const messageInDb = jest.fn().mockResolvedValue({
      id: messageId,
      user: { id: 'user2' },
    });
    const deleteMock = jest.fn().mockResolvedValue(undefined);

    const mockRepository = {
      findOne: messageInDb,
      delete: deleteMock,
    };

    const service = new MessagesService(
      mockRepository as any,
      { emit: jest.fn() } as any,
    );

    await expect(service.delete(messageId, userId)).rejects.toThrow(
      new BadRequestException('You are not allowed to delete this message'),
    );
  });
});
