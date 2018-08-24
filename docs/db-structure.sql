-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `players`
--
-- Obraz CSV z Cezara, jeden-do-jednego.
-- Do tej tabeli można (i należy) importować CSV z Cezara.
-- W PHPMyAdminie:
--  * wybrać import z CSV
--  * zaznaczyć aktualizację rekordu w przypadku duplikatu klucza głównego
--  * wybrać separator pól - średnik
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_520_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8_unicode_520_ci NOT NULL,
  `rank` decimal(3,1) NOT NULL,
  `region` varchar(2) COLLATE utf8_unicode_520_ci NOT NULL,
  `flags` varchar(2) COLLATE utf8_unicode_520_ci NOT NULL,
  `club` varchar(100) COLLATE utf8_unicode_520_ci NOT NULL,
  `discount` varchar(1) COLLATE utf8_unicode_520_ci NOT NULL,
  `paid` varchar(1) COLLATE utf8_unicode_520_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rankings`
--
-- Tabela źródłowa dla generatorów tabelek.
--

CREATE TABLE `rankings` (
  `pid` int(11) NOT NULL,
  `date` date NOT NULL,
  `place` int(11) NOT NULL,
  `score` decimal(8,4) NOT NULL,
  `region` varchar(2) COLLATE utf8_unicode_520_ci NOT NULL,
  `flags` varchar(2) COLLATE utf8_unicode_520_ci NOT NULL,
  `rank` decimal(3,1) NOT NULL,
  `club` varchar(100) COLLATE utf8_unicode_520_ci NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `temp_rankings`
--
-- Tabela, do której można importować ranking bez potrzeby wypełniania
-- w CSV źródłowej województw, płci i wieku.
--

CREATE TABLE `temp_rankings` (
  `pid` int(11) NOT NULL,
  `date` date NOT NULL,
  `place` int(11) NOT NULL,
  `score` decimal(8,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `hidden_players`
--

CREATE TABLE `hidden_players` (
  `pid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rankings`
--
ALTER TABLE `rankings`
  ADD PRIMARY KEY (`pid`,`date`);

--
-- Indexes for table `temp_rankings`
--
ALTER TABLE `temp_rankings`
  ADD PRIMARY KEY (`pid`,`date`);

--
-- Indexes for table `hidden_players`
--
ALTER TABLE `hidden_players`
  ADD PRIMARY KEY (`pid`);

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `rankings`
--
ALTER TABLE `rankings`
  ADD CONSTRAINT `rankings_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `players` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `temp_rankings`
--
ALTER TABLE `temp_rankings`
  ADD CONSTRAINT `temp_rankings_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `players` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `hidden_players`
--
ALTER TABLE `hidden_players`
  ADD CONSTRAINT `hidden_players_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
