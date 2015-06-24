DROP TABLE IF EXISTS `game_bets2`;
CREATE TABLE `game_bets2` (
  id int auto_increment PRIMARY KEY, 
  user_id varchar(50) NOT NULL, 
  artifact_id int NOT NULL, 
  timestamp int
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_unicode_ci;
