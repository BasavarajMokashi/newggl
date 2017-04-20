-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2017 at 06:09 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 7.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ggldb`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `author` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `author`) VALUES
(1, 'a'),
(2, 'a'),
(3, 'a'),
(4, 'a'),
(5, 'a'),
(6, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryId` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `ClassId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `CategoryStatus` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryId`, `CategoryName`, `ClassId`, `SubjectId`, `CategoryStatus`) VALUES
(1, 'Shapes', 1, 2, b'1'),
(2, 'Count to 3', 1, 2, b'1'),
(3, 'Count to 5', 1, 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `ChildrenId` int(11) NOT NULL,
  `ChildFirstName` varchar(255) NOT NULL,
  `ChildrenIcon` varchar(300) NOT NULL,
  `UserId` int(11) NOT NULL,
  `SecretPassword` varchar(255) NOT NULL,
  `ChildStatus` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`ChildrenId`, `ChildFirstName`, `ChildrenIcon`, `UserId`, `SecretPassword`, `ChildStatus`) VALUES
(1, 'Shreshta', 'image.png', 1, '8c0c522589d6835524eace87a490db78', b'1'),
(2, 'Ananya', 'ananya.png', 2, '474b4c334073235b3a707f40b6c1b4a1', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `childrenanswer`
--

CREATE TABLE `childrenanswer` (
  `AnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `Weightage` varchar(255) NOT NULL,
  `ChildrenId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `ClassId` int(11) NOT NULL,
  `ClassName` varchar(255) NOT NULL,
  `Captions` varchar(255) DEFAULT NULL,
  `Description` text,
  `Skills` int(5) DEFAULT NULL,
  `ClassStatus` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`ClassId`, `ClassName`, `Captions`, `Description`, `Skills`, `ClassStatus`) VALUES
(1, 'LKG', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(2, 'UKG', 'Upper Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(3, 'Class 1', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(4, 'Class 2', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(5, 'Class 3', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(6, 'Class 4', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(7, 'Class 5', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(8, 'Class 6', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(9, 'Class 7', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1'),
(10, 'Class 8', 'Lower Kintergarten Maths', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum nulla vitae dui porttitor, ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.ut egestas erat elementum. Vivamus sit amet odio semper, malesuada nunc at, porta ante. Vivamus sit amet odio semper.', 50, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `paymentinfo`
--

CREATE TABLE `paymentinfo` (
  `PaymentInfoId` int(11) NOT NULL,
  `PaymentInfoUserId` int(11) NOT NULL,
  `PaymentAmount` varchar(255) NOT NULL,
  `PaymentDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `PaymentStatus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `paymentinfo`
--

INSERT INTO `paymentinfo` (`PaymentInfoId`, `PaymentInfoUserId`, `PaymentAmount`, `PaymentDate`, `PaymentStatus`) VALUES
(1, 1, '599', '2017-03-21 06:08:29', 1);

-- --------------------------------------------------------

--
-- Table structure for table `planandsubject`
--

CREATE TABLE `planandsubject` (
  `PlanAndSubjectId` int(11) NOT NULL,
  `PlanId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `SubjectPrice` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `planandsubject`
--

INSERT INTO `planandsubject` (`PlanAndSubjectId`, `PlanId`, `SubjectId`, `SubjectPrice`) VALUES
(1, 1, 1, '599.00'),
(2, 1, 2, '699.00'),
(3, 2, 2, '450.00');

-- --------------------------------------------------------

--
-- Table structure for table `planmaster`
--

CREATE TABLE `planmaster` (
  `PlanId` int(11) NOT NULL,
  `PlanType` varchar(255) NOT NULL,
  `PlanStatus` bit(1) NOT NULL DEFAULT b'1' COMMENT '1',
  `NoOfDays` int(11) DEFAULT NULL,
  `GracePeriod` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `planmaster`
--

INSERT INTO `planmaster` (`PlanId`, `PlanType`, `PlanStatus`, `NoOfDays`, `GracePeriod`) VALUES
(1, 'Gold', b'1', 90, 5),
(2, 'SILVER', b'1', 60, 10);

-- --------------------------------------------------------

--
-- Table structure for table `questionoption`
--

CREATE TABLE `questionoption` (
  `OptionId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `QuestionOption` varchar(255) DEFAULT NULL,
  `Answer` varchar(255) DEFAULT NULL,
  `weightage` decimal(18,2) DEFAULT NULL,
  `OptionStatus` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questionoption`
--

INSERT INTO `questionoption` (`OptionId`, `QuestionId`, `QuestionOption`, `Answer`, `weightage`, `OptionStatus`) VALUES
(55, 151, 'A)Circle,B)Square,C)Rectangle', 'B)Square', '10.00', b'1'),
(64, 160, 'A)Circle,B)square', 'A)Circle', '10.00', b'1'),
(65, 161, 'A)Triangle,B)Rectangle', 'B)Rectangle', '10.00', b'1'),
(66, 162, 'A)Triangle,B)square', 'A)Triangle', '10.00', b'1'),
(67, 163, '', 'A)Circle', '10.00', b'0'),
(68, 164, '', 'A)Circle', '10.00', b'0'),
(69, 165, '', 'A)Circle', '10.00', b'0'),
(70, 166, '', 'A)Circle', '10.00', b'0'),
(71, 167, 'one.png,two.png', 'one.png', '10.00', b'1'),
(72, 168, 'one.png,two.png,three.png,four.png', 'two.png', '10.00', b'1'),
(73, 169, 'one.png,two.png,three.png,four.png', 'four.png', '10.00', b'1'),
(74, 170, 'one.png,two.png,three.png,four.png', 'two.png', '10.00', b'1'),
(75, 171, 'one.png,two.png,three.png,four.png', 'four.png', '10.00', b'1'),
(76, 172, 'one.png,two.png,three.png,four.png', 'four.png', '10.00', b'1'),
(77, 173, 'one.png,two.png,three.png', 'one.png', '10.00', b'1'),
(78, 174, 'one.png,two.png,three.png,four.png', 'two.png', '10.00', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `QuestionId` int(11) NOT NULL,
  `Question` text NOT NULL,
  `questionsHasImage` varchar(255) DEFAULT NULL,
  `SubCategoryId` int(11) DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `QuestionOptionTypeId` int(4) DEFAULT NULL,
  `QusetionsLevelid` int(4) DEFAULT NULL,
  `QuestionStatus` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`QuestionId`, `Question`, `questionsHasImage`, `SubCategoryId`, `CategoryId`, `QuestionOptionTypeId`, `QusetionsLevelid`, `QuestionStatus`) VALUES
(151, 'What shape is this?', 'lkg/square1.png', 1, 1, 1, 2, b'1'),
(160, 'What shape is this?', 'lkg/circle1.png', 1, 1, 1, 2, b'1'),
(161, 'What shape is this?', 'lkg/rectangle1.png', 1, 1, 1, 2, b'1'),
(162, 'What shape is this?', 'lkg/triangle1.png', 1, 1, 1, 2, b'1'),
(163, 'Which shape is a circle?', 'lkg/triangle1.png,lkg/circle1.png', 2, 1, 1, 2, b'0'),
(164, 'Which shape is a circle?', 'lkg/suare1.png,lkg/circle1.png', 2, 1, 1, 2, b'0'),
(165, 'Which shape is a Suare?', 'lkg/suare1.png,lkg/circle1.png', 2, 1, 1, 2, b'0'),
(166, 'Which shape is a triangle?', 'lkg/triangle1.png,lkg/circle1.png', 2, 1, 1, 2, b'0'),
(167, 'How many fishes are there?', 'lkg/fish.jpg', 1, 2, 2, 2, b'1'),
(168, 'How many snowflakes are there?', 'lkg/snowflake1.png,lkg/snowflake2.png', 1, 2, 2, 2, b'1'),
(169, 'How many elephants are there?', 'lkg/elephant1.jpg,lkg/elephant2.jpg,lkg/elephant3.jpg,lkg/elephant4.jpg', 1, 2, 2, 2, b'1'),
(170, 'How many cows are there?', 'lkg/cow1.jpg,lkg/cow2.jpg', 1, 2, 2, 2, b'1'),
(171, 'How many butterflies are there?', 'lkg/butt1.png,lkg/butt2.png,lkg/butt3.png,lkg/butt4.png', 1, 3, 2, 2, b'1'),
(172, 'How many starfish are there?', 'lkg/starfish1.png,lkg/starfish2.png,lkg/starfish3.png,lkg/starfish4.png', 1, 3, 2, 2, b'1'),
(173, 'How many pandas are there?', 'lkg/panda.jpg', 1, 3, 2, 2, b'1'),
(174, 'How many monkey are there?', 'lkg/monkey1.jpg,lkg/monkey1.jpg', 1, 3, 2, 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `questionsleveltype`
--

CREATE TABLE `questionsleveltype` (
  `QusetionsLevelid` int(11) NOT NULL,
  `QusetionsLevelName` varchar(255) NOT NULL,
  `QusetionsLevelStatus` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1->Active,2->Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questionsleveltype`
--

INSERT INTO `questionsleveltype` (`QusetionsLevelid`, `QusetionsLevelName`, `QusetionsLevelStatus`) VALUES
(1, 'four options', 1),
(2, 'three Options', 1),
(3, 'two options', 1),
(4, 'one options', 1);

-- --------------------------------------------------------

--
-- Table structure for table `qusetionoptiontype`
--

CREATE TABLE `qusetionoptiontype` (
  `OptionTypeId` int(11) NOT NULL,
  `OptionTypeName` varchar(255) NOT NULL,
  `OptionTypeStatus` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1->Active,2->Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qusetionoptiontype`
--

INSERT INTO `qusetionoptiontype` (`OptionTypeId`, `OptionTypeName`, `OptionTypeStatus`) VALUES
(1, 'options', 1),
(2, 'image count', 1);

-- --------------------------------------------------------

--
-- Table structure for table `regionwidelanguage`
--

CREATE TABLE `regionwidelanguage` (
  `LanguageId` int(11) NOT NULL,
  `Language` varchar(255) NOT NULL,
  `LanguageStatus` bit(1) NOT NULL DEFAULT b'1' COMMENT '1->Active,2->Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `regionwidelanguage`
--

INSERT INTO `regionwidelanguage` (`LanguageId`, `Language`, `LanguageStatus`) VALUES
(1, 'English', b'1'),
(2, 'Urdu', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `subcategory`
--

CREATE TABLE `subcategory` (
  `SubCategoryId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `SubCategoryName` varchar(255) NOT NULL,
  `SubCategoryStatus` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1->Active,2->Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`SubCategoryId`, `CategoryId`, `SubCategoryName`, `SubCategoryStatus`) VALUES
(1, 1, 'square', 1),
(2, 1, 'test', 1),
(3, 1, 'test1', 1),
(4, 1, 'test2', 1),
(5, 2, 'circle', 1),
(6, 2, 'circle1', 1),
(7, 2, 'circle2', 1),
(8, 2, 'circle3', 1);

-- --------------------------------------------------------

--
-- Table structure for table `syllabussubjects`
--

CREATE TABLE `syllabussubjects` (
  `SyllabusSubId` int(11) NOT NULL,
  `SyllabusSubName` varchar(255) NOT NULL,
  `SyllabusSubStatus` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `syllabussubjects`
--

INSERT INTO `syllabussubjects` (`SyllabusSubId`, `SyllabusSubName`, `SyllabusSubStatus`) VALUES
(1, 'English', b'1'),
(2, 'Maths', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `LoginUserId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `UserType` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `EmailId` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `UserStatus` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'default-1(active),2(inactive)'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`LoginUserId`, `UserId`, `UserType`, `UserName`, `EmailId`, `Password`, `UserStatus`) VALUES
(3, 2, 2, 'sadana', 'sadana@gmail.com', 'sadana', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usercategoryresult`
--

CREATE TABLE `usercategoryresult` (
  `UserResultId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `ChildrenId` int(11) NOT NULL,
  `NumberOfQuestions` int(11) NOT NULL,
  `AnsweredQuestions` int(11) NOT NULL,
  `Score` float NOT NULL,
  `SmartScore` float NOT NULL,
  `Date` date NOT NULL,
  `RightAnswer` int(11) NOT NULL,
  `WrongAnswer` int(11) NOT NULL,
  `StartTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `EndTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usercategoryresult`
--

INSERT INTO `usercategoryresult` (`UserResultId`, `CategoryId`, `ChildrenId`, `NumberOfQuestions`, `AnsweredQuestions`, `Score`, `SmartScore`, `Date`, `RightAnswer`, `WrongAnswer`, `StartTime`, `EndTime`) VALUES
(1, 2, 1, 20, 15, 75.5, 60, '2017-03-20', 10, 5, '2017-03-21 11:32:35', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `userprofile`
--

CREATE TABLE `userprofile` (
  `UserId` int(11) NOT NULL,
  `UserPlanId` int(11) NOT NULL,
  `UserEmailId` varchar(255) NOT NULL,
  `NoOfChildren` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `UserStatus` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1->Active,2->Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userprofile`
--

INSERT INTO `userprofile` (`UserId`, `UserPlanId`, `UserEmailId`, `NoOfChildren`, `UserName`, `UserStatus`) VALUES
(1, 1, 'basu.belgaum@gmail.com', 1, 'Basavaraj', 1),
(2, 2, 'rajuec.rj@gmail.com', 2, 'Raju', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usersubjects`
--

CREATE TABLE `usersubjects` (
  `UserSubjectId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `SubjectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usersubjects`
--

INSERT INTO `usersubjects` (`UserSubjectId`, `UserId`, `SubjectId`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `wronganswer`
--

CREATE TABLE `wronganswer` (
  `WrongAnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `Image1` varchar(255) NOT NULL,
  `Explanation1` varchar(255) NOT NULL,
  `Image2` varchar(255) NOT NULL,
  `Explanation2` varchar(255) NOT NULL,
  `Image3` varchar(255) NOT NULL,
  `Explanation3` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wronganswer`
--

INSERT INTO `wronganswer` (`WrongAnswerId`, `QuestionId`, `Image1`, `Explanation1`, `Image2`, `Explanation2`, `Image3`, `Explanation3`) VALUES
(6, 151, 'lkg/square1.png', 'Answer is Square because this image has four equal sides so it is square', 'lkg/square1.png', 'Answer is Square because this image has four equal sides so it is square', 'lkg/square1.png', 'Answer is Square because this image has four equal sides so it is square'),
(11, 160, 'lkg/circle1.png', 'its very simple.. it is round so it is circle', 'lkg/circle1.png', 'its very simple.. it is round so it is circle', 'lkg/circle1.png', 'its very simple.. it is round so it is circle'),
(12, 161, 'lkg/rectangle1.png', 'it has four sides and opposite sides are equal.. ', 'lkg/rectangle1.png', 'it has four sides and opposite sides are equal.. ', 'lkg/rectangle1.png', 'it has four sides and opposite sides are equal.. '),
(13, 162, 'lkg/triangle1.png', 'it has three sides, so it is triangle..', 'lkg/triangle1.png', 'it has three sides, so it is triangle..', 'lkg/triangle1.png', 'it has three sides, so it is triangle..'),
(14, 172, 'lkg/starfish1.png,lkg/starfish2.png,lkg/starfish3.png,lkg/starfish4.png', 'it has three sides, so it is triangle..', 'lkg/starfish1.png,lkg/starfish2.png,lkg/starfish3.png,lkg/starfish4.png', 'it has three sides, so it is triangle..', 'lkg/starfish1.png,lkg/starfish2.png,lkg/starfish3.png,lkg/starfish4.png', 'it has three sides, so it is triangle..'),
(15, 173, 'lkg/panda.jpg', 'it has three sides, so it is triangle..', 'lkg/panda.jpg', 'it has three sides, so it is triangle..', 'lkg/panda.jpg', 'it has three sides, so it is triangle..'),
(16, 174, 'lkg/monkey1.jpg,lkg/monkey1.jpg', 'it has three sides, so it is triangle..', 'lkg/monkey1.jpg,lkg/monkey1.jpg', 'it has three sides, so it is triangle..', 'lkg/monkey1.jpg,lkg/monkey1.jpg', 'it has three sides, so it is triangle..');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryId`),
  ADD KEY `ClassId` (`ClassId`),
  ADD KEY `SubjectId` (`SubjectId`);

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`ChildrenId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `childrenanswer`
--
ALTER TABLE `childrenanswer`
  ADD PRIMARY KEY (`AnswerId`),
  ADD KEY `QuestionId` (`QuestionId`),
  ADD KEY `OptionId` (`OptionId`),
  ADD KEY `ChildrenId` (`ChildrenId`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`ClassId`);

--
-- Indexes for table `paymentinfo`
--
ALTER TABLE `paymentinfo`
  ADD PRIMARY KEY (`PaymentInfoId`),
  ADD KEY `PaymentInfoUserId` (`PaymentInfoUserId`);

--
-- Indexes for table `planandsubject`
--
ALTER TABLE `planandsubject`
  ADD PRIMARY KEY (`PlanAndSubjectId`),
  ADD KEY `PlanId` (`PlanId`),
  ADD KEY `SubjectId` (`SubjectId`);

--
-- Indexes for table `planmaster`
--
ALTER TABLE `planmaster`
  ADD PRIMARY KEY (`PlanId`);

--
-- Indexes for table `questionoption`
--
ALTER TABLE `questionoption`
  ADD PRIMARY KEY (`OptionId`),
  ADD KEY `QuestionId` (`QuestionId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`QuestionId`),
  ADD KEY `CategoryId` (`CategoryId`);

--
-- Indexes for table `questionsleveltype`
--
ALTER TABLE `questionsleveltype`
  ADD PRIMARY KEY (`QusetionsLevelid`);

--
-- Indexes for table `qusetionoptiontype`
--
ALTER TABLE `qusetionoptiontype`
  ADD PRIMARY KEY (`OptionTypeId`);

--
-- Indexes for table `regionwidelanguage`
--
ALTER TABLE `regionwidelanguage`
  ADD PRIMARY KEY (`LanguageId`);

--
-- Indexes for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`SubCategoryId`);

--
-- Indexes for table `syllabussubjects`
--
ALTER TABLE `syllabussubjects`
  ADD PRIMARY KEY (`SyllabusSubId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`LoginUserId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `usercategoryresult`
--
ALTER TABLE `usercategoryresult`
  ADD PRIMARY KEY (`UserResultId`),
  ADD KEY `CategoryId` (`CategoryId`),
  ADD KEY `ChildrenId` (`ChildrenId`);

--
-- Indexes for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD PRIMARY KEY (`UserId`),
  ADD KEY `UserPlanId` (`UserPlanId`);

--
-- Indexes for table `usersubjects`
--
ALTER TABLE `usersubjects`
  ADD PRIMARY KEY (`UserSubjectId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `SubjectId` (`SubjectId`);

--
-- Indexes for table `wronganswer`
--
ALTER TABLE `wronganswer`
  ADD PRIMARY KEY (`WrongAnswerId`),
  ADD KEY `QuestionId` (`QuestionId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `children`
--
ALTER TABLE `children`
  MODIFY `ChildrenId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `childrenanswer`
--
ALTER TABLE `childrenanswer`
  MODIFY `AnswerId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `ClassId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `paymentinfo`
--
ALTER TABLE `paymentinfo`
  MODIFY `PaymentInfoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `planandsubject`
--
ALTER TABLE `planandsubject`
  MODIFY `PlanAndSubjectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `planmaster`
--
ALTER TABLE `planmaster`
  MODIFY `PlanId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `questionoption`
--
ALTER TABLE `questionoption`
  MODIFY `OptionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;
--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `QuestionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;
--
-- AUTO_INCREMENT for table `questionsleveltype`
--
ALTER TABLE `questionsleveltype`
  MODIFY `QusetionsLevelid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `qusetionoptiontype`
--
ALTER TABLE `qusetionoptiontype`
  MODIFY `OptionTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `regionwidelanguage`
--
ALTER TABLE `regionwidelanguage`
  MODIFY `LanguageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `subcategory`
--
ALTER TABLE `subcategory`
  MODIFY `SubCategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `syllabussubjects`
--
ALTER TABLE `syllabussubjects`
  MODIFY `SyllabusSubId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `LoginUserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `usercategoryresult`
--
ALTER TABLE `usercategoryresult`
  MODIFY `UserResultId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `userprofile`
--
ALTER TABLE `userprofile`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `usersubjects`
--
ALTER TABLE `usersubjects`
  MODIFY `UserSubjectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `wronganswer`
--
ALTER TABLE `wronganswer`
  MODIFY `WrongAnswerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `syllabussubjects` (`SyllabusSubId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `children`
--
ALTER TABLE `children`
  ADD CONSTRAINT `children_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `userprofile` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `childrenanswer`
--
ALTER TABLE `childrenanswer`
  ADD CONSTRAINT `childrenanswer_ibfk_1` FOREIGN KEY (`OptionId`) REFERENCES `questionoption` (`OptionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `childrenanswer_ibfk_3` FOREIGN KEY (`ChildrenId`) REFERENCES `children` (`ChildrenId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `childrenanswer_ibfk_4` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`QuestionId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `paymentinfo`
--
ALTER TABLE `paymentinfo`
  ADD CONSTRAINT `paymentinfo_ibfk_1` FOREIGN KEY (`PaymentInfoUserId`) REFERENCES `userprofile` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `planandsubject`
--
ALTER TABLE `planandsubject`
  ADD CONSTRAINT `planandsubject_ibfk_1` FOREIGN KEY (`PlanId`) REFERENCES `planmaster` (`PlanId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `planandsubject_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `syllabussubjects` (`SyllabusSubId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questionoption`
--
ALTER TABLE `questionoption`
  ADD CONSTRAINT `questionoption_ibfk_1` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`QuestionId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`CategoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `userprofile` (`UserId`);

--
-- Constraints for table `usercategoryresult`
--
ALTER TABLE `usercategoryresult`
  ADD CONSTRAINT `usercategoryresult_ibfk_2` FOREIGN KEY (`ChildrenId`) REFERENCES `children` (`ChildrenId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usercategoryresult_ibfk_3` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`CategoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD CONSTRAINT `userprofile_ibfk_1` FOREIGN KEY (`UserPlanId`) REFERENCES `planmaster` (`PlanId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usersubjects`
--
ALTER TABLE `usersubjects`
  ADD CONSTRAINT `usersubjects_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `userprofile` (`UserId`),
  ADD CONSTRAINT `usersubjects_ibfk_2` FOREIGN KEY (`SubjectId`) REFERENCES `syllabussubjects` (`SyllabusSubId`);

--
-- Constraints for table `wronganswer`
--
ALTER TABLE `wronganswer`
  ADD CONSTRAINT `wronganswer_ibfk_1` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`QuestionId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
