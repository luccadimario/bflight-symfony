<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240726170115 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE maintenance_log_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE maintenance_log (id INT NOT NULL, plane_id INT NOT NULL, date TIMESTAMP(0) WITH TIME ZONE NOT NULL, description TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_26CA3DF3F53666A8 ON maintenance_log (plane_id)');
        $this->addSql('COMMENT ON COLUMN maintenance_log.date IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('ALTER TABLE maintenance_log ADD CONSTRAINT FK_26CA3DF3F53666A8 FOREIGN KEY (plane_id) REFERENCES plane (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file ADD maintenance_log_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F3610C09A6B8F FOREIGN KEY (maintenance_log_id) REFERENCES maintenance_log (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_8C9F3610C09A6B8F ON file (maintenance_log_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE file DROP CONSTRAINT FK_8C9F3610C09A6B8F');
        $this->addSql('DROP SEQUENCE maintenance_log_id_seq CASCADE');
        $this->addSql('ALTER TABLE maintenance_log DROP CONSTRAINT FK_26CA3DF3F53666A8');
        $this->addSql('DROP TABLE maintenance_log');
        $this->addSql('DROP INDEX IDX_8C9F3610C09A6B8F');
        $this->addSql('ALTER TABLE file DROP maintenance_log_id');
    }
}
