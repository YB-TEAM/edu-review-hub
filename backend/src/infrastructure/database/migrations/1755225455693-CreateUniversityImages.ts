import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateUniversityImages1755225455693 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "university_images",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "university_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "image_url",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "cloudinary_public_id",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "image_type",
            type: "enum",
            enum: ["logo", "banner", "campus", "facility", "event", "other"],
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "alt_text",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "sort_order",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "is_primary",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "uploaded_by",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
        indices: [
          {
            name: "IDX_UNIVERSITY_IMAGES_UNIVERSITY_ID",
            columnNames: ["university_id"],
          },
          {
            name: "IDX_UNIVERSITY_IMAGES_TYPE",
            columnNames: ["image_type"],
          },
          {
            name: "IDX_UNIVERSITY_IMAGES_PRIMARY",
            columnNames: ["is_primary"],
          },
          {
            name: "IDX_UNIVERSITY_IMAGES_ACTIVE",
            columnNames: ["is_active"],
          },
          {
            name: "IDX_UNIVERSITY_IMAGES_COMPOSITE",
            columnNames: ["university_id", "image_type"],
          },
          {
            name: "IDX_UNIVERSITY_IMAGES_PRIMARY_COMPOSITE",
            columnNames: ["university_id", "is_primary"],
          },
        ],
        foreignKeys: [
          {
            columnNames: ["university_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "universities",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("university_images");
  }
}
