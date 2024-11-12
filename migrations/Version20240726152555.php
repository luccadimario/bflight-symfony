<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240726152555 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE plane_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE plane (id INT NOT NULL, owner_id INT NOT NULL, friendly_name VARCHAR(255) DEFAULT NULL, tail VARCHAR(255) NOT NULL, active BOOLEAN NOT NULL, serial VARCHAR(255) DEFAULT NULL, icao VARCHAR(255) DEFAULT NULL, model VARCHAR(255) DEFAULT NULL, type_name VARCHAR(255) DEFAULT NULL, regowner VARCHAR(255) DEFAULT NULL, hours DOUBLE PRECISION NOT NULL, plane_data JSON DEFAULT NULL, cover_file TEXT DEFAULT NULL, mileage DOUBLE PRECISION DEFAULT NULL, last_log_date TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C1B32D807E3C61F9 ON plane (owner_id)');
        $this->addSql('COMMENT ON COLUMN plane.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('ALTER TABLE plane ADD CONSTRAINT FK_C1B32D807E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE plane_id_seq CASCADE');
        $this->addSql('ALTER TABLE plane DROP CONSTRAINT FK_C1B32D807E3C61F9');
        $this->addSql('DROP TABLE plane');
    }
}
