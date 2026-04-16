import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminAndMessages1776245000000 implements MigrationInterface {
  name = 'SeedAdminAndMessages1776245000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const insertedUsers = await queryRunner.query(
      `
        INSERT INTO "users" ("email", "username", "passwordHash")
        VALUES ($1, $2, $3)
        ON CONFLICT ("email") DO NOTHING
        RETURNING "id"
      `,
      ['admin@gmail.com', 'generated', passwordHash]
    );

    let adminUserId: string | undefined = insertedUsers?.[0]?.id;

    if (!adminUserId) {
      const existingUsers = await queryRunner.query(
        `
          SELECT "id"
          FROM "users"
          WHERE "email" = $1
          LIMIT 1
        `,
        ['admin@gmail.com']
      );
      adminUserId = existingUsers?.[0]?.id;
    }

    if (!adminUserId) {
      return;
    }

    await queryRunner.query(
      `
        INSERT INTO "messages" ("tag", "text", "userId")
        VALUES
          ('0', 'Seed message for category 0', $1),
          ('1', 'Seed message for category 1', $1),
          ('2', 'Seed message for category 2', $1),
          ('1', 'Seed message for category 3', $1),
          ('1', 'Seed message for category 4', $1),
          ('2', 'Seed message for category 5', $1),
          ('2', 'Seed message for category 6', $1),
          ('0', 'Seed message for category 7', $1),
          ('0', 'Seed message for category 8', $1),
          ('1', 'Seed message for category 9', $1),
          ('1', 'Seed message for category 10', $1)
      `,
      [adminUserId]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DELETE FROM "messages"
        WHERE "text" IN (
          'Seed message for category 0',
          'Seed message for category 1',
          'Seed message for category 2',
          'Seed message for category 3',
          'Seed message for category 4',
          'Seed message for category 5',
          'Seed message for category 6',
          'Seed message for category 7',
          'Seed message for category 8',
          'Seed message for category 9',
          'Seed message for category 10'
        )
      `
    );

    await queryRunner.query(
      `
        DELETE FROM "users"
        WHERE "email" = $1 AND "username" = $2
      `,
      ['admin@gmail.com', 'generated']
    );
  }
}
