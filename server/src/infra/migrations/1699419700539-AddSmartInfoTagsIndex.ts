import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSmartInfoTagsIndex1699419700539 implements MigrationInterface {
    name = 'AddSmartInfoTagsIndex1699419700539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS si_tags ON smart_info USING GIN (tags);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS si_tags;`);
    }
}
