import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1776192326242 implements MigrationInterface {
  name = 'CreateUsersTable1776192326242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "k" TO "username"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "UQ_701a92a24eff0d2b6f8a8baae00" TO "UQ_fe0bb3f6520ee0469504521e710"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" TO "UQ_701a92a24eff0d2b6f8a8baae00"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "username" TO "k"`
    );
  }
}
