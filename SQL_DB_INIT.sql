-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql.metropolia.fi
-- Generation Time: Dec 10, 2020 at 05:49 PM
-- Server version: 10.1.48-MariaDB
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leevilim`
--

-- --------------------------------------------------------

--
-- Table structure for table `bm_ad`
--

CREATE TABLE `bm_ad` (
  `ad_id` int(11) NOT NULL,
  `item_name` text NOT NULL,
  `city` text NOT NULL,
  `price` text NOT NULL,
  `description` text NOT NULL,
  `listed_by` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `ctg_ref` int(11) NOT NULL,
  `posted_on` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bm_ad`
--

INSERT INTO `bm_ad` (`ad_id`, `item_name`, `city`, `price`, `description`, `listed_by`, `type`, `ctg_ref`, `posted_on`) VALUES
(3, 'Car', 'Espoo', '2000', 'I am selling a car I don\'t need anymore', 6, 'sell', 3, '2020-12-10 17:27:28'),
(4, 'Turtle', 'Vantaa', '420', 'Selling my turtle to get some money to buy macaroni and Cyberpunk 2077\r\nName: Jango\r\nCondition: Good\r\nAge: 69', 5, 'sell', 6, '2020-12-10 17:29:56'),
(5, 'Selling ultra good pc', 'Any', '750', '- Intel pentium G4560  \r\n- Nvidia GTX 610  \r\n- 4GB RAM  \r\n- 1TB HDD', 7, 'sell', 4, '2020-12-10 17:30:02'),
(6, 'Dishwasher', 'Vantaa', '50', 'Selling my dishwasher to pay rent after gf dumped me since I sold our turtle, can ship for extra 3 euros', 5, 'sell', 4, '2020-12-10 17:35:02'),
(7, 'Buying stuff', 'Any', '1', 'I buy all the stuffs you have', 7, 'buy', 6, '2020-12-10 17:35:07'),
(8, 'Doubling money', 'Secret', '100000', 'Give me money, I give 2x back', 7, 'sell', 6, '2020-12-10 17:38:57'),
(9, 'Looking for a house', 'Any', '300000', 'Hi I would like to buy a house', 9, 'buy', 2, '2020-12-10 17:40:51'),
(10, 'Cheap macaroni please', 'Vantaa', '1', 'Do you have any macaroni that you just don\'t wanna get rid of but it\'s so bad/overdue that you don\'t wanna keep either. No worries, I\'m here to buy any macaroni leftovers. Price is per kilo', 5, 'buy', 6, '2020-12-10 17:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `bm_ctg`
--

CREATE TABLE `bm_ctg` (
  `ctg_id` int(11) NOT NULL,
  `category` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bm_ctg`
--

INSERT INTO `bm_ctg` (`ctg_id`, `category`) VALUES
(1, 'Lifestyle'),
(2, 'Housing'),
(3, 'Vehicles'),
(4, 'Electronics'),
(5, 'Hobbies'),
(6, 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `bm_images`
--

CREATE TABLE `bm_images` (
  `image_id` int(11) NOT NULL,
  `image` text,
  `ad_ref` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bm_images`
--

INSERT INTO `bm_images` (`image_id`, `image`, `ad_ref`) VALUES
(3, 'e324715ecbdb6e7831bb981a1bcdd0eb', 3),
(4, '1063ce81e9d2fad650fe0f8cbe68f4b6', 4),
(5, 'fe7c78d8640c70870be94b4c6a464229', 5),
(6, '2495ba0f425c572dd9d20b619ff3ba2d', 6),
(7, 'c400573aa04672f119086935b472d248', 7),
(8, 'fc784e40a7c986803dc520df378d5818', 8),
(9, 'b1e3cd965a8184461d355c62d06dc2c9', 9),
(10, '960d0cb1b7af9511770e384ade4472dd', 10);

-- --------------------------------------------------------

--
-- Table structure for table `bm_rep`
--

CREATE TABLE `bm_rep` (
  `rep_id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `voter` int(11) NOT NULL,
  `is_like` int(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bm_rep`
--

INSERT INTO `bm_rep` (`rep_id`, `user`, `voter`, `is_like`) VALUES
(3, 5, 7, 1),
(4, 5, 0, 1),
(5, 5, 0, 1),
(6, 5, 0, 1),
(7, 5, 0, 1),
(8, 5, 0, 1),
(9, 5, 0, 1),
(10, 5, 0, 1),
(11, 5, 0, 1),
(12, 5, 0, 1),
(13, 5, 0, 1),
(14, 5, 0, 1),
(15, 5, 0, 1),
(16, 5, 0, 1),
(17, 5, 0, 1),
(18, 5, 0, 1),
(19, 5, 0, 1),
(20, 5, 0, 0),
(21, 5, 0, 0),
(22, 7, 0, 1),
(23, 7, 0, 1),
(24, 7, 0, 1),
(25, 7, 0, 0),
(26, 7, 0, 0),
(27, 7, 0, 0),
(28, 7, 0, 0),
(29, 7, 0, 0),
(30, 7, 0, 0),
(31, 7, 0, 0),
(32, 7, 0, 0),
(33, 7, 0, 0),
(34, 7, 0, 0),
(35, 7, 0, 0),
(36, 7, 0, 0),
(37, 7, 0, 0),
(38, 7, 0, 0),
(39, 7, 0, 0),
(40, 7, 0, 0),
(41, 7, 0, 0),
(42, 7, 0, 0),
(43, 7, 0, 0),
(44, 7, 0, 0),
(45, 7, 0, 0),
(46, 7, 0, 0),
(47, 7, 0, 0),
(48, 7, 0, 0),
(49, 7, 0, 0),
(50, 7, 0, 0),
(51, 7, 0, 0),
(52, 7, 0, 0),
(53, 7, 0, 0),
(54, 7, 0, 0),
(55, 7, 0, 0),
(56, 7, 0, 0),
(57, 7, 0, 0),
(58, 7, 0, 0),
(59, 7, 0, 0),
(60, 7, 0, 0),
(61, 7, 0, 0),
(62, 7, 0, 0),
(63, 7, 0, 0),
(64, 7, 0, 0),
(65, 7, 0, 0),
(66, 7, 0, 0),
(67, 7, 0, 0),
(68, 7, 0, 0),
(69, 7, 0, 0),
(70, 7, 0, 0),
(71, 7, 0, 0),
(72, 7, 0, 0),
(73, 7, 0, 0),
(74, 7, 0, 0),
(75, 7, 0, 0),
(76, 7, 0, 0),
(77, 7, 0, 0),
(78, 7, 0, 0),
(79, 7, 0, 0),
(80, 6, 7, 1),
(81, 9, 10, 1),
(82, 7, 10, 0),
(83, 7, 5, 1),
(84, 6, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `bm_user`
--

CREATE TABLE `bm_user` (
  `user_id` int(11) NOT NULL,
  `password` text NOT NULL,
  `name` text NOT NULL,
  `user_city` text NOT NULL,
  `phone_number` text NOT NULL,
  `email` text NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bm_user`
--

INSERT INTO `bm_user` (`user_id`, `password`, `name`, `user_city`, `phone_number`, `email`, `creation_date`) VALUES
(1, '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'Testi Testimies', 'Helsinki', '0401231122', '1@gmail.com', '2020-12-10 17:06:01'),
(2, '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'Mikko Mallikas', 'Porvoo', '0451113322', '2@gmail.com', '2020-12-10 17:06:01'),
(3, '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'Maija Mallikas', 'Espoo', '020202', '3@gmail.com', '2020-12-10 17:06:01'),
(4, '$2a$10$qlUkr2ILBnWkMw77StuUZeqPepsxcuArCOs8Hj8YhAf3NEkq8Ixb6', 'account', 'Tampere', '020202', '222www2saasdd2@gmail.com', '2020-12-10 17:06:01'),
(5, '$2a$10$Vqj5V9a4zExaATeqFOD3A.0aSIOjDIauDDQzANSTFfohBCGM8zB72', 'Jasu Honkanen', 'Espoo', '0503527785', 'jasu.honkanen2@gmail.com', '2020-12-10 17:26:20'),
(6, '$2a$10$S7.0M3SnamVTiKrP37iyLOWqMBNZU7R5g.d/sMDZxpA1y6leJYHk.', 'Leevi Limnell', 'Espoo', '01010202', '1234@gmail.com', '2020-12-10 17:26:44'),
(7, '$2a$10$2bVDOVV4uaS/hnqFqq.bOucsIvxmlrMkHDlVdJRm1V8kOdBiJTqLK', 'Market_Man', 'Helsinki', '00207700', 'marketman@market.com', '2020-12-10 17:28:28'),
(8, '$2a$10$LyoP3QFeaGgGgFWBE30GrutQC/EGUVMiH8nD50UofLAELA2nt3n6.', 'Teemu Tirkkonen', 'Helsinki', '0441124325723', 'Teemu.T@gmail.com', '2020-12-10 17:29:36'),
(9, '$2a$10$enZU0eMXeWMXnekuIw1Tde/27z5b1fc6xDhtlIQbjZq.zMVDigB3q', 'HouseBuyer', 'Currently no', '0440440444', 'buyhose@gmail.com', '2020-12-10 17:40:14'),
(10, '$2a$10$pZSKZ8V1XZnkiDKeG2JhIuoEz.5JGAf.9DJLEUDnWLvZD.l.lu9gS', 'adsadsads', 'Testi', '22882828288', 'djaskadsj@gmail.com', '2020-12-10 17:47:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bm_ad`
--
ALTER TABLE `bm_ad`
  ADD PRIMARY KEY (`ad_id`),
  ADD KEY `listed_by` (`listed_by`),
  ADD KEY `ctg_ref` (`ctg_ref`);

--
-- Indexes for table `bm_ctg`
--
ALTER TABLE `bm_ctg`
  ADD PRIMARY KEY (`ctg_id`);

--
-- Indexes for table `bm_images`
--
ALTER TABLE `bm_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `ad_ref` (`ad_ref`);

--
-- Indexes for table `bm_rep`
--
ALTER TABLE `bm_rep`
  ADD PRIMARY KEY (`rep_id`),
  ADD KEY `user` (`user`),
  ADD KEY `voter` (`voter`);

--
-- Indexes for table `bm_user`
--
ALTER TABLE `bm_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bm_ad`
--
ALTER TABLE `bm_ad`
  MODIFY `ad_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bm_images`
--
ALTER TABLE `bm_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bm_rep`
--
ALTER TABLE `bm_rep`
  MODIFY `rep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `bm_user`
--
ALTER TABLE `bm_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
