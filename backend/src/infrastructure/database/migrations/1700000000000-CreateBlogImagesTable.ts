import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from "typeorm";

export class CreateBlogImagesTable1700000000000 implements MigrationInterface {
    name = 'CreateBlogImagesTable1700000000000'

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
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "blog_id",
                        type: "uuid"
                    },
                    {
                        name: "image_url",
                        type: "text"
                    },
                    {
                        name: "alt_text",
                        type: "varchar",
                        length: "500",
                        isNullable: true
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Create indexes
        await queryRunner.createIndex("blog_images", {
            name: "IDX_blog_images_blog_id_image_url",
            columnNames: ["blog_id", "image_url"],
            isUnique: true
        });

        await queryRunner.createIndex("blog_images", {
            name: "IDX_blog_images_image_url",
            columnNames: ["image_url"]
        });

        // Create foreign key
        await queryRunner.createForeignKey("blog_images", {
            name: "FK_blog_images_blog_id",
            columnNames: ["blog_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "blogs",
            onDelete: "CASCADE"
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const table = await queryRunner.getTable("blog_images");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("blog_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("blog_images", foreignKey);
        }

        // Drop indexes
        await queryRunner.dropIndex("blog_images", "IDX_blog_images_blog_id_image_url");
        await queryRunner.dropIndex("blog_images", "IDX_blog_images_image_url");

        // Drop table
        await queryRunner.dropTable("blog_images");
    }
}
