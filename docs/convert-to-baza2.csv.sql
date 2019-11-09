ALTER TABLE `players`
      ADD COLUMN `gender` varchar(1) COLLATE utf8_unicode_520_ci NOT NULL
      AFTER `region`;
UPDATE `players` SET `gender` = 'K', `flags` = SUBSTRING(`flags` FROM 2) WHERE flags LIKE 'K%';
UPDATE `players` SET `gender` = 'M' WHERE gender = '';
