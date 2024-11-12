<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240727221537 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE plane ADD thumbnail_path TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE plane ADD medium_path TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE plane ADD original_path TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE plane DROP thumbnail_path');
        $this->addSql('ALTER TABLE plane DROP medium_path');
        $this->addSql('ALTER TABLE plane DROP original_path');
    }
}
