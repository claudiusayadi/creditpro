import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetFields1760635783815 implements MigrationInterface {
    name = 'AddPasswordResetFields1760635783815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role" AS ENUM('admin', 'user')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "name" character varying(255),
                "avatar" character varying(255),
                "phone" character varying(20),
                "bio" character varying(255),
                "verified" boolean NOT NULL DEFAULT false,
                "verification_code" character varying(6),
                "verification_code_expires_at" TIMESTAMP,
                "password_reset_code" character varying(6),
                "password_reset_code_expires_at" TIMESTAMP,
                "role" "public"."user_role" NOT NULL DEFAULT 'user',
                "last_login_at" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."media_type" AS ENUM('image', 'document', 'pdf')
        `);
        await queryRunner.query(`
            CREATE TABLE "media" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying(255) NOT NULL,
                "original_filename" character varying(255) NOT NULL,
                "file_path" character varying(500) NOT NULL,
                "url" character varying(500) NOT NULL,
                "mime_type" character varying(100) NOT NULL,
                "size" bigint NOT NULL,
                "type" "public"."media_type" NOT NULL,
                "extension" character varying(10) NOT NULL,
                "year" character varying(4) NOT NULL,
                "month" character varying(2) NOT NULL,
                "alt_text" character varying(255),
                "description" character varying(500),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"),
                CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "resources" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "type" character varying(100) NOT NULL,
                "file_url" character varying(500) NOT NULL,
                "thumbnail_url" character varying(255),
                "file_size" bigint,
                "published" boolean NOT NULL DEFAULT true,
                "download_count" integer NOT NULL DEFAULT '0',
                "category_id" uuid,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "location" character varying(255),
                "start_date" TIMESTAMP NOT NULL,
                "end_date" TIMESTAMP,
                "image_url" character varying(255),
                "registration_url" character varying(255),
                "published" boolean NOT NULL DEFAULT true,
                "featured" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying(100) NOT NULL,
                "value" text NOT NULL,
                "group" character varying(100),
                "description" text,
                "is_public" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"),
                CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'replied', 'archived')
        `);
        await queryRunner.query(`
            CREATE TABLE "contacts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "phone" character varying(20),
                "subject" character varying(255),
                "message" text NOT NULL,
                "status" "public"."contact_status" NOT NULL DEFAULT 'new',
                "admin_notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "careers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "location" character varying(255),
                "type" character varying(100),
                "active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_febfc45dc83d58090d3122fde3d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "blogs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "content" text NOT NULL,
                "slug" character varying(255),
                "image_url" character varying(500),
                "excerpt" text,
                "published" boolean NOT NULL DEFAULT true,
                "featured" boolean NOT NULL DEFAULT false,
                "category_id" uuid,
                "author_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "resources"
            ADD CONSTRAINT "FK_42a91403d5498bcd3cde20a3980" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "blogs"
            ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "blogs"
            ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"
        `);
        await queryRunner.query(`
            ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"
        `);
        await queryRunner.query(`
            ALTER TABLE "resources" DROP CONSTRAINT "FK_42a91403d5498bcd3cde20a3980"
        `);
        await queryRunner.query(`
            DROP TABLE "blogs"
        `);
        await queryRunner.query(`
            DROP TABLE "careers"
        `);
        await queryRunner.query(`
            DROP TABLE "contacts"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."contact_status"
        `);
        await queryRunner.query(`
            DROP TABLE "settings"
        `);
        await queryRunner.query(`
            DROP TABLE "events"
        `);
        await queryRunner.query(`
            DROP TABLE "resources"
        `);
        await queryRunner.query(`
            DROP TABLE "categories"
        `);
        await queryRunner.query(`
            DROP TABLE "media"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."media_type"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role"
        `);
    }

}
