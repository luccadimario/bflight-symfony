<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240827235116 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD mech_cert_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE event ADD event_name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE event ADD event_category VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE event ADD description TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE event ADD event_date DATE NOT NULL');
        $this->addSql('ALTER TABLE event ADD digital_signature VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7A1EEBC81 FOREIGN KEY (mech_cert_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3BAE0AA7A1EEBC81 ON event (mech_cert_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA7A1EEBC81');
        $this->addSql('DROP INDEX UNIQ_3BAE0AA7A1EEBC81');
        $this->addSql('ALTER TABLE event DROP mech_cert_id');
        $this->addSql('ALTER TABLE event DROP event_name');
        $this->addSql('ALTER TABLE event DROP event_category');
        $this->addSql('ALTER TABLE event DROP description');
        $this->addSql('ALTER TABLE event DROP event_date');
        $this->addSql('ALTER TABLE event DROP digital_signature');
    }
}
