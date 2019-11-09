ALTER TABLE `players`
      ADD COLUMN `gender` varchar(1) COLLATE utf8_unicode_520_ci NOT NULL
      AFTER `region`;
UPDATE `players` SET `gender` = 'K', `flags` = SUBSTRING(`flags` FROM 2) WHERE flags LIKE 'K%';
UPDATE `players` SET `gender` = 'M' WHERE gender = '';
ALTER TABLE `rankings`
      ADD COLUMN `gender` varchar(1) COLLATE utf8_unicode_520_ci NOT NULL
      AFTER `region`;
UPDATE `rankings` SET `gender` = 'K', `flags` = SUBSTRING(`flags` FROM 2) WHERE flags LIKE 'K%';
UPDATE `rankings` SET `gender` = 'M' WHERE gender = '';
