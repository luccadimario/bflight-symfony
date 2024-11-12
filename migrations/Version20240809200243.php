<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240809200243 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE event_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE mlog_entry_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE event (id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE mlog_entry (id INT NOT NULL, owner_id INT NOT NULL, maintenance_log_id INT NOT NULL, file_relation_id INT DEFAULT NULL, event_relation_id INT DEFAULT NULL, guikey VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, type VARCHAR(50) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2AC585357E3C61F9 ON mlog_entry (owner_id)');
        $this->addSql('CREATE INDEX IDX_2AC58535C09A6B8F ON mlog_entry (maintenance_log_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2AC5853510ED6F39 ON mlog_entry (file_relation_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2AC5853599DF42DB ON mlog_entry (event_relation_id)');
        $this->addSql('COMMENT ON COLUMN mlog_entry.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('ALTER TABLE mlog_entry ADD CONSTRAINT FK_2AC585357E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mlog_entry ADD CONSTRAINT FK_2AC58535C09A6B8F FOREIGN KEY (maintenance_log_id) REFERENCES maintenance_log (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mlog_entry ADD CONSTRAINT FK_2AC5853510ED6F39 FOREIGN KEY (file_relation_id) REFERENCES file (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mlog_entry ADD CONSTRAINT FK_2AC5853599DF42DB FOREIGN KEY (event_relation_id) REFERENCES event (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE file DROP CONSTRAINT fk_8c9f36107e3c61f9');
        $this->addSql('DROP INDEX idx_8c9f36107e3c61f9');
        $this->addSql('ALTER TABLE file DROP owner_id');
        $this->addSql('ALTER TABLE file DROP guikey');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE event_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE mlog_entry_id_seq CASCADE');
        $this->addSql('ALTER TABLE mlog_entry DROP CONSTRAINT FK_2AC585357E3C61F9');
        $this->addSql('ALTER TABLE mlog_entry DROP CONSTRAINT FK_2AC58535C09A6B8F');
        $this->addSql('ALTER TABLE mlog_entry DROP CONSTRAINT FK_2AC5853510ED6F39');
        $this->addSql('ALTER TABLE mlog_entry DROP CONSTRAINT FK_2AC5853599DF42DB');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP TABLE mlog_entry');
        $this->addSql('ALTER TABLE file ADD owner_id INT NOT NULL');
        $this->addSql('ALTER TABLE file ADD guikey VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT fk_8c9f36107e3c61f9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_8c9f36107e3c61f9 ON file (owner_id)');
    }
}
