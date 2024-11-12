<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240721202613 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ADD email_verified BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD nickname VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD date_created TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD date_updated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER email DROP NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64997E91718 ON "user" (auth0_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX UNIQ_8D93D64997E91718');
        $this->addSql('ALTER TABLE "user" DROP email_verified');
        $this->addSql('ALTER TABLE "user" DROP nickname');
        $this->addSql('ALTER TABLE "user" DROP date_created');
        $this->addSql('ALTER TABLE "user" DROP date_updated');
        $this->addSql('ALTER TABLE "user" ALTER email SET NOT NULL');
    }
}
