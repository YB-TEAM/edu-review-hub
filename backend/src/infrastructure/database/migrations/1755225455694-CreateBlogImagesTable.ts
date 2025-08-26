import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateBlogImagesTable1755225455694 implements MigrationInterface {
  name = "CreateBlogImagesTable1755225455694";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_images",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "blog_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "image_url",
            type: "text",
            isNullable: false,
          },
          {
            name: "alt_text",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
            isNullable: false,
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
            name: "IDX_blog_images_blog_id_image_url",
            columnNames: ["blog_id", "image_url"],
            isUnique: true,
          },
          {
            name: "IDX_blog_images_image_url",
            columnNames: ["image_url"],
          },
          {
            name: "IDX_blog_images_blog_id",
            columnNames: ["blog_id"],
          },
          {
            name: "IDX_blog_images_active",
            columnNames: ["is_active"],
          },
        ],
        foreignKeys: [
          {
            name: "FK_blog_images_blog_id",
            columnNames: ["blog_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "blogs",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("blog_images");
  }
}
