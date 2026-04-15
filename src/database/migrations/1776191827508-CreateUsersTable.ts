import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1776191827508 implements MigrationInterface {
  name = 'CreateUsersTable1776191827508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "k" character varying(50) NOT NULL, "passwordHash" character varying(255) NOT NULL, "passwordRecoveryHash" character varying(255), "passwordRecoveryExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_701a92a24eff0d2b6f8a8baae00" UNIQUE ("k"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
