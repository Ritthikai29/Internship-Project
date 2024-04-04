-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2023 at 04:27 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sts_bidding`
--

-- --------------------------------------------------------

--
-- Table structure for table `bidder`
--

CREATE TABLE `bidder` (
  `bidder_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL COMMENT 'Project ID',
  `v_id` int(11) NOT NULL COMMENT 'Vendor ID',
  `cer_file` varchar(255) DEFAULT NULL COMMENT 'Certificate File',
  `vat_file` varchar(255) DEFAULT NULL COMMENT 'Vat Document File',
  `bk_file` varchar(255) DEFAULT NULL COMMENT 'Book Bank File',
  `joining_date` date NOT NULL,
  `joining_time` time NOT NULL,
  `bstatus_id` int(11) NOT NULL COMMENT 'Bidder Status ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bidding`
--

CREATE TABLE `bidding` (
  `biding_id` int(11) NOT NULL,
  `bidder_id` int(11) NOT NULL,
  `bid_amount` varchar(255) NOT NULL,
  `boq_file` varchar(255) NOT NULL,
  `payment_file` varchar(255) NOT NULL,
  `bided_date` date NOT NULL,
  `bided_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bidding_negotiate`
--

CREATE TABLE `bidding_negotiate` (
  `negotiate_id` int(11) NOT NULL,
  `bidding` int(11) NOT NULL,
  `bid_amount` varchar(255) NOT NULL,
  `new_amount` varchar(255) NOT NULL,
  `negotiate_date` date NOT NULL,
  `negotiate_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bidding_negotiate_sub`
--

CREATE TABLE `bidding_negotiate_sub` (
  `sub_id` int(11) NOT NULL,
  `bidding_id` int(11) NOT NULL,
  `sub_name` varchar(100) NOT NULL,
  `bid_sub_amount` varchar(255) NOT NULL,
  `new_sub_amount` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bidding_sub`
--

CREATE TABLE `bidding_sub` (
  `sub_id` int(11) NOT NULL,
  `bidding_id` int(11) NOT NULL,
  `sub_name` varchar(255) NOT NULL,
  `sub_price` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `committee`
--

CREATE TABLE `committee` (
  `committee_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL COMMENT 'Group ID',
  `staff_id` int(11) NOT NULL,
  `crole_id` int(11) NOT NULL COMMENT 'Committee Role ID',
  `otp` varchar(10) NOT NULL,
  `to_open` int(11) NOT NULL COMMENT 'Number Envelope To Open',
  `opened` int(11) NOT NULL COMMENT 'Number Opened Envelope',
  `cststus_id` int(11) NOT NULL COMMENT 'Committee Status ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `committee_envelope`
--

CREATE TABLE `committee_envelope` (
  `open_id` int(11) NOT NULL,
  `committee_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `opened_date` date NOT NULL,
  `opened_time` time NOT NULL,
  `comment` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `envelope_group`
--

CREATE TABLE `envelope_group` (
  `group_id` int(11) NOT NULL,
  `added_date` date NOT NULL,
  `added_time` time NOT NULL,
  `staff_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `envelope_group_setting`
--

CREATE TABLE `envelope_group_setting` (
  `setting_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL COMMENT 'Project_ID',
  `open_date` date NOT NULL,
  `open_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generate_log`
--

CREATE TABLE `generate_log` (
  `log_id` int(11) NOT NULL,
  `errorFunc` varchar(100) NOT NULL,
  `errorMsg` varchar(4500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_committee_accept`
--

CREATE TABLE `log_committee_accept` (
  `log_id` int(11) NOT NULL,
  `group_id` varchar(255) NOT NULL COMMENT 'Group ID',
  `staff_id` int(11) NOT NULL,
  `crole_id` int(11) NOT NULL COMMENT 'Committee Role ID',
  `accept_date` date NOT NULL,
  `accept_time` time NOT NULL,
  `accept` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_project_approve`
--

CREATE TABLE `log_project_approve` (
  `log_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `apv_id` int(11) NOT NULL COMMENT 'Approver ID',
  `ap_date` date NOT NULL,
  `ap_time` time NOT NULL,
  `approve` tinyint(1) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_project_finish_approve`
--

CREATE TABLE `log_project_finish_approve` (
  `log_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `apv_id` int(11) NOT NULL,
  `ap_date` date NOT NULL,
  `ap_time` time NOT NULL,
  `approve` tinyint(1) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_project_sub_approve`
--

CREATE TABLE `log_project_sub_approve` (
  `approval_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `apv_id` int(11) NOT NULL COMMENT 'Approver ID',
  `apvt_id` int(11) NOT NULL COMMENT 'Approver Type ID',
  `ap_date` date NOT NULL,
  `ap_time` time NOT NULL,
  `approve` tinyint(1) NOT NULL,
  `approve_log` varchar(255) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_project_sub_approve`
--

INSERT INTO `log_project_sub_approve` (`approval_id`, `pj_id`, `apv_id`, `apvt_id`, `ap_date`, `ap_time`, `approve`, `approve_log`, `reason`, `comment`) VALUES
(10, '6476bc9880393', 4, 1, '2023-05-28', '13:45:02', 1, 'Approve', NULL, NULL),
(11, '6476bc9880393', 4, 1, '2023-05-28', '13:51:24', 1, 'Approve', NULL, NULL),
(12, '6476bc9880393', 1, 1, '2023-05-28', '13:52:06', 1, 'Approve', NULL, NULL),
(17, '6476bc9880393', 5, 1, '2023-05-31', '14:52:03', 1, 'Checked', NULL, NULL),
(18, '6476bc9880393', 1, 1, '2023-05-31', '14:52:38', 1, 'Checked', NULL, NULL),
(19, '6476bc9880393', 3, 1, '2023-05-31', '17:55:47', 1, 'Approved', NULL, NULL),
(20, '6476bc9880393', 3, 3, '2023-05-31', '18:16:00', 1, 'Approved', NULL, NULL),
(21, '647742b741a88', 4, 1, '2023-05-31', '19:58:23', 1, 'Calculate', NULL, NULL),
(22, '647742b741a88', 5, 2, '2023-05-31', '20:04:20', 1, 'Checked', NULL, NULL),
(23, '647742b741a88', 3, 3, '2023-05-31', '20:15:19', 1, 'Approved', NULL, NULL),
(24, '64804b59e30fe', 2, 1, '2023-06-07', '16:19:22', 1, 'Calculate', NULL, NULL),
(25, '64804b59e30fe', 3, 2, '2023-06-07', '16:27:00', 1, 'Checked', NULL, NULL),
(26, '64804b59e30fe', 4, 3, '2023-06-07', '16:29:12', 1, 'Approved', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `log_vendor_approve`
--

CREATE TABLE `log_vendor_approve` (
  `log_id` int(11) NOT NULL,
  `v_id` int(11) NOT NULL COMMENT 'Vendor ID',
  `apv_id` int(11) NOT NULL COMMENT 'Approver ID',
  `ap_date` date NOT NULL,
  `ap_time` time NOT NULL,
  `approve` tinyint(1) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `comment` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `pj_id` varchar(255) NOT NULL COMMENT 'Project ID',
  `pj_name` varchar(100) NOT NULL COMMENT 'Project Name',
  `pjt_id` int(11) NOT NULL COMMENT 'Project Type ID',
  `wt_id` int(11) NOT NULL COMMENT 'Work Type ID',
  `div_id` int(11) NOT NULL COMMENT 'Division ID',
  `dept_id` int(11) NOT NULL COMMENT 'Department ID',
  `tor_file` varchar(255) NOT NULL,
  `job_desc_file` varchar(255) NOT NULL,
  `auction_file` varchar(255) DEFAULT NULL,
  `auction_price` varchar(255) DEFAULT NULL COMMENT 'Encrypt Price',
  `edit_auction` varchar(255) DEFAULT NULL,
  `date_added` date NOT NULL,
  `time_added` time NOT NULL,
  `date_ended` date DEFAULT NULL,
  `time_ended` time DEFAULT NULL,
  `pj_key` varchar(10) NOT NULL COMMENT 'Joining Project Key',
  `sub_price` tinyint(1) NOT NULL,
  `pstatus_id` int(11) NOT NULL COMMENT 'Project Status ID',
  `pj_adder_id` int(11) NOT NULL COMMENT 'Project Adder ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`pj_id`, `pj_name`, `pjt_id`, `wt_id`, `div_id`, `dept_id`, `tor_file`, `job_desc_file`, `auction_file`, `auction_price`, `edit_auction`, `date_added`, `time_added`, `date_ended`, `time_ended`, `pj_key`, `sub_price`, `pstatus_id`, `pj_adder_id`) VALUES
('645121886586b', 'โครงการสร้างโรง.....', 1, 1, 10, 17, 'QhHeTvW28HMQmaS/3LRvVyGdpPCvhyfCCgKFJ1YkXpLVExK2xn5fu3lfnAW5txQ9E6cdsu5g6SbLl4EfcMyzxTNG9O5H1iSVsDtD8LwUQMM=', 'NJdjoAa1phv6xO2N+dIdOuAK23zShtPynJ8+s6XQKzOgTKHWe8w4SdQq194qdrJieIIg7/piFDeNkwqARCkyHxirNZN98cNCkFHHFPbWipc=', 'kDeGpndluY6wYxKRDrcluMBzTRfsTNB+MTuCHFsZG9RkSgKkxtHy+8XsUkP8TZg1CVbxVm0AiUdXjtqdVfAw5pI6rm6nr0QK+AEjX9pfSeY=', '5yoYvaLxz8sxD26wvgOVh9jGP4NSEzVZK/iRXFzgghL8Ui96yQVbowj/ikt3XxcgtPuCRw9ykPKYPgoFSl2MPA==', '', '2023-05-02', '21:43:20', NULL, NULL, '752081', 0, 1, 1),
('6451223574e5f', 'โครงการติดตั้งกล้องวงจรปิด', 1, 1, 10, 17, 'MMW0HrsgS7PptfrMSME1fFLJDIfpSI1uTei75WWQ8UV/kWYUj9EXbnnDWcA6QHBJY+XVnJB9UNLvT5apshl1ePE2mvGQDyB4P1CSJptlJ5c=', '8VSFoAGz/5nqTsVMlj5D5pO301JGU/jxWg8rt9MC3GliWHf3JFn+YShtz+oawBXXt8HrwxG8MT0aQlHufXY2hcK1a9+4sg3tEJzmCDFKoAo=', 'b+MMqfLW6teZazca813vDIcSXC2l48NcphiIcfSTqlvbE21yXtlo5k9PxWYs9SqfKdsgnDnzrksq3YRHLqgDkV8G6Rs4derb3h1Ws3FEM3g=', 'jvIBAXrDJ9mFA2z10hvbC+eGjluR/tNLKOjEzJSa51mHpfqYBqUwuw55XseDnZbe1Rcy6NzzEXUTcPPFEJEsMg==', '', '2023-05-02', '21:46:13', NULL, NULL, '6AE918', 0, 3, 1),
('645123b7d079b', 'โครงการติดตั้งแผงโซล่าเซลล์', 1, 1, 10, 17, 'Q26AIhGBF5r+8a8lHxA+WmCypmdpDAiYr8IwMbabIofIsF3TWuhTwLguYZIfbS2bHUqe+/mndO3YVTrSCo8PIxhsK5NgYRaVLDTjhXZCQKc=', 'NIgey81b7H8ntpO9J2s1x7l2gKRJ9ofL8flGmDQ3XF0gcsfruKwVo9M7PJGp5PmDvbXujEwZdchkka5lh/vRMcJrGCWqIEDbaCgx3+pi0lE=', 'E8wWIgFPxmkL3vzjP6Q9zEPZaHZNzcWZ/oxgAIMs8kAam5mtBOnir5s4Kk5fxfwSCa6x9PyNbU5G6qJT1EcY8SmFleG9w3BXrNVN2fYN9QY=', 'MDANOBIFxhd0DNZuzgBuTRIZ5nyz/7xZsZrdRzHDcdHdOktPHG5HhN1dMQpZNQACCg8k8aTOaICPbRPoIdMniw==', '', '2023-05-02', '21:52:39', NULL, NULL, '04E611', 0, 3, 1),
('6476a32de7a55', 'Test', 2, 1, 13, 15, 'A8ff01yfpD6+Dm/dyQ0sej5TdpdLgedkgdQ0o4zFR0BFOekRcnrXjcolb56qUKeYHdua8/rvHiS3nXxCmcucX2Rgz/LP5qY35H2UfapiD54=', 's1Anl4oB20yxiSPIfZpJkuCh8RuJ3Xldcalqse7jcCeRuzxJ/iyAMIEFrJgYuC/07t78pfSzWkW4pIq7VX1EtCNWsSoTM1IkdyXSdLkL2A4=', 'KMxkq1SomJT5HswhGyaeTceLwWfF6Enh4m5TnMtRTipaPSEce+KC/OqxF5xwNu26NG2bgUwDW3IEgg1owlD4urV1yNCV8osmtZwGYEB9Mmc=', 'mXCLJjVLn0tV4PJRfqb7+AJY2eUvK/qHhFCqWVh9FkK4PcLW0nZFPlv9xkwP7YuIwvQOfIlvzVwzNJx9p5d9aA==', '', '2023-05-31', '08:30:21', NULL, NULL, '7230D0', 1, 3, 1),
('6476a34d005b1', 'Test', 2, 1, 13, 15, 'rkq0tk9AIeW67Hf5jtyFSVlYEsXcbHYDCf9FWKl0v/gK+EY7GO4Dh4ReJjwFxTllFG7txJXsolSyAlLGnb7e8ohFFAILLNxUjypb6MbzZUM=', 'Jfp8JTRjBVjH7OVnS29CTY+xiUqO47V071j0euXm5PGsArEfNsxhHiNhz9WLCGqeapoMNwbf81hSY8jXo7uEtTe1vSAh4tKJ6qee94/2wvs=', '+Z74XGtVte8KEtdQYOisTka+BdEzxD1L9bhcQxmA3JD+vkjxFVhjxrdcDQFPe+X/OOPUnvTeNlqRobaq4vYkHijYE2CZa3Byzl4jKwCHNrA=', '8USSybzckGVbNFGSqmPyD/5TaO1K7cVAWy42zqtSmKuSE99h5VuBs35Uzmb+Xxyve1d91qUWGqiYat0f7cmwNw==', '', '2023-05-31', '08:30:53', NULL, NULL, 'F5E471', 1, 3, 1),
('6476aa0ab5390', 'ทดลองสร้าง', 1, 1, 13, 16, 'Arh3V9Szna0mgn225o26DP/WhD6pczN7qLDfDl2JgP7F7sHRkxmQUBuuKTNHGiawCJgW86Gut2yJOt+4ypOCmnBnG6bngNsNcUvrbbBv++w=', 'vhS14gSjUUxN2JO2M/tDHbdOpzq/AVSpbfak/RnKXKA7wURH1TEDqMwKODHRWDUI+7iIezkUT00dSvqo7ZCF2oNnDgPfXaB4IDJLm537XAc=', '71RZIQs5ZuMt0sfz5EEJjJLLe5L61oh7/oGmzsHaF2vHuvzfLMzOEnLbS3C+9pu4tkvYfQmy2HK+7ghg2OPTCggKhmdBDLB8vv32H3fBQCU=', 'Iz+gWDbv727LHxerPLw90sDvLgBn57pLQyNVNjZGeG31g04imMtpCA0gNI5in1Zv15G/kOi4SzPSH4DpEuRAQg==', '', '2023-05-31', '08:59:38', NULL, NULL, '3AD9BF', 1, 3, 1),
('6476baab4d3ff', '100', 2, 1, 14, 20, 'c3leGRybXI4tfGtPkvVZ+rJFbAqgCnl/+zEL4UVkPh1E4T0p2GbbTRuouB+BiN2yO9kWKX969O6ZPbBITCnoR8oUQds4AjRBnrHPXmkoA14=', 'eFDPpWAo6dQNXLK6Iqp1zFRl+pbLRGJYO4cqWTZAptpOOBwoQvWsEUaLk7BzM5bYHp/iG2NdTA7BxP/CSZzPBAeRVabTx1lUkyfE82o5F2I=', 'nZ7HVGZ8mJ/NWb0ETs45Lh7YEhmEf/ywXrxRe4y9zkIoU8pscwZdw1BVrbyUUpXy8+ksOKUl9OqwIkQdHe482XkZDsUuL2l/BF+HY13I9Ok=', '8kNrAQeKOzIQHGh1iINjOjhhQGnW9ybrPqlfIT1PrdlWkWUpq0hQIUZMP1zkNpEzRbAcCtDJ8kHIJSLqzD2Zhw==', '', '2023-05-31', '10:10:35', NULL, NULL, 'D3D254', 2, 3, 1),
('6476bc9880393', '100', 1, 1, 1, 1, 'jf1Ck1RzZi2/P3JSRfg226XRMIPDGtMWUT+ycZjFqgGZqZkCHkHXGXIHLh3UC7F+k/RB3kYvcOuXtZ6QVTJ5eg6L/0ibU4vj204nHWQE2Ws=', '63MwAKeEMrIxqVi2bDM+Lu6LQPrWById8aftLHxmV7HFEzUGLFlWMGfRya4P18kn15Jsq2w2se56GiMMCy4ASZtEccV1llGxgGmgxbHt6j0=', 'PP9QfwdaNUmiwPlckBuiQ1LvfhPGx73bcrVpP0PbwB/Em0SW5cPA6q0Z5GwDIJ4tqOpih/H1on8+e06cA8bYniWSrZKipesnVqDuzKeLOwo=', '5R6D1Zd2FTD55V/uycoyDccmZDb1XyUJWAfiVBz0Ltty2TUrg9CVcqVeHuqSh3dno8yQNCSe8SJheD5RyWIZQw==', 'yzbgpITNRhCptlQ7mP0oX5rexE5VLSg2tw+pUOTYHbJFxeLMTPsEdEEzRrQ38Vxo02X7IshN2F2fFYLoXiS/4Q==', '2023-05-31', '10:18:48', NULL, NULL, '1C0E69', 1, 20, 1),
('647742b741a88', '600', 1, 1, 11, 14, '0c8p5HTTO81MyliW3Sr/qbv6dVzbmN5F1JFVJI9syKi+rxyWLmU4bH5GZYO9RbtlnTM9LKCn1HF3tM1uzkOkNt5NqC7NrNBKHl3eEDqas5E=', 'ixairrDZyuAG+7JJVGyeRd8OSPfrfh3xwzFUhXwsIRGSjdr2igZ2rnRQZbymld4aKMcyXMOFipkIakDiwGdwyKgFK6tobIkNCTRU4MuPycA=', 'gEhr6ReZA7ns+i9Nd5RhG4qe+ZW4Yfwrp6DVmZ6XzX6U6MxRa8iH1B4k93LrqhektyzpjuN2SGTFv2gkoM9DY1/BqjMez3JwD0XSUBQAPKQ=', 'ukV7WaAlquBy77mFEq2zMTlfR7MEqtvPAnmaAln8r35uOFNSySANk4ZG8jIatt1/eCNWgPEPhGBW3twPgbdNwg==', '0jYf79kWDL2pEDSvk6dmiUIuJcVRiLrpNJFEizFK8J+xKyK+QIPK9mSo5rc5hboQwu+5U1BIiwrQLCcD1BmhGA==', '2023-05-31', '19:51:03', NULL, NULL, '5D74AC', 1, 3, 1),
('64804b59e30fe', 'ทดลอง123456', 2, 1, 12, 18, 'gsGEp4IjyCF9rwnvgOS3sh+MK9XlbqWnptuWNq/P8z12PZv+7bjWIKBYYBTSqehcOB5TW4WHJIFzStGHGeYQrjCptkH3FERavFCnURRaBHg=', 'oS9N/KGA7X0sLhyyZmGWwKUo7Y7FmFDgljvLoCfYwGtDG3ReZzLzH3jsByhb61uahImdJJ9zNjtqCMPvg3ocN7j+TVPV7/PZuYNvEXXC03g=', '44+ZTTEjDsn3hF9XCCBgaSixpkWKj8436khsyfyxymXrLu42cVbzb55Mn28Kyl+AlCOI0U4eH/1/965bweEleRevPHb+m/FMob+P23w9JEQ=', 'qc5R3Pl3NTuzu++rzdbx4LhsVthx5ad+t811mFe/tyyJm8tbAvxc8RHjlgO8N49XbT9kfi98e/lcqdHK5T7AYw==', 'YgcpmfmTBYpHDztDzEO2hMRuQ4+nYvtV0gxIDG68qhPQL5XRYJ2tsGzp/k6b7qDhTAQkOOHu86ucuj7egARB3A==', '2023-06-07', '16:18:17', NULL, NULL, 'A96FA2', 1, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_bid_setting`
--

CREATE TABLE `project_bid_setting` (
  `pj_id` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_history`
--

CREATE TABLE `project_history` (
  `pj_id` varchar(255) NOT NULL COMMENT 'Project ID',
  `pj_name` varchar(100) NOT NULL COMMENT 'Project Name',
  `pjt_name` varchar(100) NOT NULL COMMENT 'Project Type',
  `wt_name` varchar(100) NOT NULL COMMENT 'Work Type',
  `div_name` varchar(100) NOT NULL COMMENT 'Division',
  `dept_name` varchar(100) NOT NULL COMMENT 'Department',
  `tor_file` varchar(255) NOT NULL,
  `job_desc_file` varchar(255) NOT NULL,
  `auction_file` varchar(255) NOT NULL,
  `auction_price` varchar(255) NOT NULL COMMENT 'Encrypt Price',
  `date_added` date NOT NULL,
  `time_added` time NOT NULL,
  `date_ended` date DEFAULT NULL,
  `time_ended` time DEFAULT NULL,
  `pj_key` varchar(10) NOT NULL COMMENT 'Joining Project Key',
  `sub_price` tinyint(1) NOT NULL,
  `status_name` varchar(100) NOT NULL COMMENT 'Project Status',
  `status_hex` varchar(100) NOT NULL,
  `pj_adder_id` int(11) NOT NULL COMMENT 'Project Adder ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_history`
--

INSERT INTO `project_history` (`pj_id`, `pj_name`, `pjt_name`, `wt_name`, `div_name`, `dept_name`, `tor_file`, `job_desc_file`, `auction_file`, `auction_price`, `date_added`, `time_added`, `date_ended`, `time_ended`, `pj_key`, `sub_price`, `status_name`, `status_hex`, `pj_adder_id`) VALUES
('1', 'Test', '1', '1', '1', '1', '64472e855d117.pdf', '64472ea41e554.pdf', '1', '1', '2023-04-01', '12:26:02', '0000-00-00', '00:00:00', '12345', 0, '3', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_join_setting`
--

CREATE TABLE `project_join_setting` (
  `pj_id` varchar(255) NOT NULL,
  `insurance` double NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_join_setting`
--

INSERT INTO `project_join_setting` (`pj_id`, `insurance`, `start_date`, `start_time`, `end_date`, `end_time`) VALUES
('645121886586b', 5000, '2023-05-02', '17:13:15', '2023-05-02', '17:13:15');

-- --------------------------------------------------------

--
-- Table structure for table `project_sub_approver`
--

CREATE TABLE `project_sub_approver` (
  `psa_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `apv_id` int(11) NOT NULL COMMENT 'Approver ID',
  `apvt_id` int(11) NOT NULL COMMENT 'Approver Type ID',
  `approve` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_sub_approver`
--

INSERT INTO `project_sub_approver` (`psa_id`, `pj_id`, `apv_id`, `apvt_id`, `approve`) VALUES
(41, '6476bc9880393', 1, 2, 1),
(42, '6476bc9880393', 4, 1, 1),
(43, '6476bc9880393', 5, 2, 1),
(44, '6476bc9880393', 3, 3, 1),
(57, '647742b741a88', 4, 1, 1),
(58, '647742b741a88', 2, 1, 1),
(59, '647742b741a88', 5, 2, 1),
(60, '647742b741a88', 3, 3, 1),
(61, '64804b59e30fe', 2, 1, 1),
(62, '64804b59e30fe', 3, 2, 1),
(63, '64804b59e30fe', 4, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_sub_auction`
--

CREATE TABLE `project_sub_auction` (
  `sub_id` int(11) NOT NULL,
  `pj_id` varchar(255) NOT NULL,
  `sub_name` varchar(100) NOT NULL,
  `sub_price` varchar(255) NOT NULL,
  `edit_sub_price` varchar(255) NOT NULL,
  `last_staff` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_sub_auction`
--

INSERT INTO `project_sub_auction` (`sub_id`, `pj_id`, `sub_name`, `sub_price`, `edit_sub_price`, `last_staff`) VALUES
(61, '6476bc9880393', 'a', 'EqPETzElfRmrsFPRI2/jUNE1bNMYjFdWkbu47n2TYiaW00w4aAhcmp6FAaz4yzgt0wg7vPmffteI9nvQGJ0Ymg==', 'Xrf0rxkqpgzj9GNCmuHdm1h0/TsiDBipQiNY/iSxEWMJqDzQS2mpLnA0PtiOFyWIONv/28buqIAZ/I+tH05+qg==', 3),
(62, '6476bc9880393', 'b', 'PFVfIdxcSQBYPSslNLICch0wvPeGdgrtNP8xgxlkZcd8zyh5pgOMV6B/ndYTwzxvT+tgcbgkIN0vRDm62ZDFbw==', 'uXdT+ma7FRW+Ls94bUUwR2JHM4RZrV1QiakND7hQzd9ihBGc/ov/xaOEotn4Rqm/5iPq+EgHLBIUGAUAtdbV/A==', 3),
(63, '6476bc9880393', 'C', 'EpBRbiwFDfXPgh3QaNDeKuw7CiAnilya46XSE9QowlAE0MrbJPprc3EE4k3bMuP/gH1VwNyzV7e8vastx8QWcw==', 'vhSEC2ihudOamGwKiuVjmp+0Eqcj15moVqvQUeSXj1uPkjcntLVBwedsxF8vWj/MBtVjLKV4CC0wZNySH4sY3w==', 3),
(64, '6476bc9880393', 'd', 'YO95n/xZGHDmMnRyRjDEEYfToDomhvRhWfdY/ypmVPMTW5Ix/lVPiaV5DNYWsg3VrVN0Hdb1M0UfxhtgqVXhqA==', 'k3jWN0QDxFiwLMv2gMkMQ9eJqqrAFCijR1CSVYFkTYwa118kPK9dJEqOamkGiwXqTR+ZxYUISgqtSNok7GINvg==', 3),
(65, '6476bc9880393', 'e', 'P3DxTHJ2DfeGABqN8dKvg19sdzPbAnO84FS1Rd0OePcR6acySEBEQKMzvtb2yxsCdImPY0HZiXZu05dUTXyo3w==', 'IJQNyTVKPWIgRnMxe54r21YqRBdPkAfQemopmmADyloCS3AS/QR8/8UtoeYxnlpZGD+18Fyf+qUShBvYlEbmpQ==', 3),
(66, '647742b741a88', 'Test1', '9cRv+STfaH+c3XLwTD0Z+zTbQ4Zibt3dxHP8qPyVlu78/Jxo6CrqHP/HwmRhqxWIoi6cK0rN7b+wX7z3khB5/A==', 'J90W9At7eTQfcV+wsA+JB6Re+VfS46zJLxO1Iqw7xPm9lE5IAB8GZTFATIF7lluo2zCAOhlONUzVs6n4oGt5qg==', 3),
(67, '64804b59e30fe', 'Test123456', 'HYUNlv8aq/6P8Rl/3yvUxZXknw4eSpXHAE9o6k1/oizHGbMF3vVQxQ855+giLuXWlMbOLr9/EINDmd+ieGqXlQ==', '9N7GGlBdvmCrefr/6NNi9gNSaTQbNHKNTHw3IwbSteCtHyNz0dHBEBPlefI3dvNBva+qrCwzcXCMg6Ma+VZYYg==', 4);

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `roleId` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `roleName` varchar(50) NOT NULL,
  `mainPath` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_user`
--

INSERT INTO `role_user` (`roleId`, `role`, `roleName`, `mainPath`) VALUES
(1, 'Outsider', 'Vendor', 'STS10000/STS10100'),
(1, 'Staff', 'Owner', 'STS20000/STS20100'),
(2, 'Staff', 'Contractor', 'STS30000/STS30100'),
(3, 'Staff', 'Secretary', 'STS40000/STS40100'),
(4, 'Staff', 'Committee', 'STS50000/STS50100');

-- --------------------------------------------------------

--
-- Table structure for table `status_bid`
--

CREATE TABLE `status_bid` (
  `bstatus_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `contractor_hex` varchar(100) NOT NULL,
  `vendor_hex` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_bid`
--

INSERT INTO `status_bid` (`bstatus_id`, `status_name`, `contractor_hex`, `vendor_hex`) VALUES
(1, 'รออนุมัติการเข้าร่วม', '#000000', '#000000'),
(2, 'ถูกปฏิเสธการเข้าร่วม', '#000000', '#ff0000'),
(3, 'รอการเชิญเข้าร่วม', '#000000', '#000000'),
(4, 'ยังไม่เสนอราคา', '#000000', '#ffa500'),
(5, 'รอตรวจสอบเอกสาร', '#ffa500', '#000000'),
(6, 'เอกสารถูกต้องครบถ้วน', '#008000', '#008000'),
(7, 'เอกสารไม่ถูกต้อง', '#ff0000', '#ff0000'),
(8, 'เจรจาต่อรอง', '#000000', '#ffa500'),
(9, 'รอตรวจสอบราคาต่อรอง', '#000000', '#000000'),
(10, 'สละสิทธิ์', '#ff0000', '#ff0000'),
(11, 'ได้รับการคัดเลือก', '#008000', '#008000'),
(12, 'ไม่ได้รับการคัดเลือก', '#ff0000', '#ff0000');

-- --------------------------------------------------------

--
-- Table structure for table `status_committee`
--

CREATE TABLE `status_committee` (
  `cstatus_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `status_hex` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_committee`
--

INSERT INTO `status_committee` (`cstatus_id`, `status_name`, `status_hex`) VALUES
(1, 'ยังเปิดซองไม่ครบ', '#ff0000'),
(2, 'เปิดซองครบแล้ว', '#008000'),
(3, '-', '');

-- --------------------------------------------------------

--
-- Table structure for table `status_project`
--

CREATE TABLE `status_project` (
  `pstatus_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `pj_status` varchar(100) NOT NULL,
  `pj_hex` varchar(100) NOT NULL,
  `owner_hex` varchar(100) NOT NULL,
  `contractor_hex` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_project`
--

INSERT INTO `status_project` (`pstatus_id`, `status_name`, `pj_status`, `pj_hex`, `owner_hex`, `contractor_hex`) VALUES
(1, 'รอคำนวณราคากลาง\r\n', 'ยังไม่เปิดเข้าร่วม', '#000000', '#000000', '#000000'),
(2, 'รอตรวจสอบราคากลาง', 'ยังไม่เปิดเข้าร่วม', '#000000', '#000000', '#000000'),
(3, 'รอตรวจสอบเอกสาร', 'ยังไม่เปิดเข้าร่วม', '#000000', '#000000', '#ffa500'),
(4, 'รอเปิดรับผู้เข้าร่วมประกวดราคา', 'ยังไม่เปิดเข้าร่วม', '#000000', '#000000', '#000000'),
(5, 'เปิดรับผู้เข้าร่วมประกวดราคา', 'เปิดเข้าร่วม', '#008000', '#000000', '#000000'),
(6, 'รออนุมัติรับเหมานอก List', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(7, 'อนุมัติผู้รับเหมานอก List แล้ว', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(8, 'รออนุมัติส่งหนังสือเชิญ', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(9, 'กำลังประกวดราคา', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(10, 'รอเปิดซองเปรียบเทียบราคา', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(11, 'กำลังเปิดซอง', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(12, 'กำลังเจรจาต่อรองราคาใหม่', 'กำลังประกวดราคา', '#ffa500', '#000000', '#000000'),
(13, 'รออนุมัติผลเสร็จสิ้นประกวดราคา', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#000000', '#000000'),
(14, 'รออนุมัติผลล้มประกวดราคา', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#000000', '#000000'),
(15, 'รอแจ้งผลเสร็จสิ้นประกวดราคา', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#000000', '#ffa500'),
(16, 'รอแจ้งผลล้มประกวดราคา', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#000000', '#ffa500'),
(17, 'ต้องแก้ไขเอกสาร', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#ffa500', '#000000'),
(18, 'เสร็จสิ้น', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#008000', '#008000'),
(19, 'ล้ม', 'งานประกวดราคาจบลงแล้ว', '#ff0000', '#ff0000', '#ff0000'),
(20, 'รออนุมัติราคากลาง', 'ยังไม่เปิดเข้าร่วม', '#000000', '#000000', '#000000');

-- --------------------------------------------------------


--
-- Table structure for table `status_user`
--

CREATE TABLE `status_user` (
  `ustatus_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_user`
--

INSERT INTO `status_user` (`ustatus_id`, `status_name`) VALUES
(1, 'ยังใช้งาน'),
(2, 'ไม่ถูกใช้งาน'),
(3, 'ถูกระงับการใช้งาน'),
(4, 'ถูกเก็บรักษา');

-- --------------------------------------------------------

--
-- Table structure for table `tb_arole`
--

CREATE TABLE `tb_arole` (
  `arole_id` int(11) NOT NULL COMMENT 'Approver Role ID',
  `role_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_arole`
--

INSERT INTO `tb_arole` (`arole_id`, `role_name`) VALUES
(1, 'ผู้คำนวณราคากลาง'),
(2, 'ผู้ตรวจสอบ'),
(3, 'ผู้อนุมัติ');

-- --------------------------------------------------------

--
-- Table structure for table `tb_company`
--

CREATE TABLE `tb_company` (
  `company_id` int(1) NOT NULL,
  `company_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_company`
--

INSERT INTO `tb_company` (`company_id`, `company_name`) VALUES
(1, 'บริษัท ปูนซิเมนต์ไทย (ทุ่งสง) จำกัด');

-- --------------------------------------------------------

--
-- Table structure for table `tb_crole`
--

CREATE TABLE `tb_crole` (
  `crole_id` int(11) NOT NULL COMMENT 'Committee Role ID',
  `role_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_crole`
--

INSERT INTO `tb_crole` (`crole_id`, `role_name`) VALUES
(1, 'หัวหน้ากรรมการ'),
(2, 'กรรมการรอง'),
(3, 'กรรมการทั่วไป'),
(4, 'เลขา');

-- --------------------------------------------------------

--
-- Table structure for table `tb_department`
--

CREATE TABLE `tb_department` (
  `department_id` int(1) NOT NULL,
  `department_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_department`
--

INSERT INTO `tb_department` (`department_id`, `department_name`) VALUES
(1, 'Administration & Procurement'),
(2, 'Analytical and Testing Lab'),
(3, 'Autonomous Maintenance'),
(4, 'BSE - CSC'),
(5, 'BSE South Chain'),
(6, 'Cement Plant - TS'),
(7, 'Co-Creation and Operation Development'),
(8, 'Construction Solution System & Process'),
(9, 'Contractor Management'),
(10, 'CPAC Solution'),
(11, 'CPAC Solution Center กระบี่'),
(12, 'CPAC Solution Center นครศรีธรรมราช'),
(13, 'CPAC Solution Center ภูเก็ต'),
(14, 'CPAC Solution Center สงขลา'),
(15, 'CPAC Solution Center สุราษฎร์ธานี'),
(16, 'CS Operation'),
(17, 'Digital Transformation'),
(18, 'E2E Supply Chain'),
(19, 'EPS'),
(20, 'Franchise 2'),
(21, 'Franchise 3'),
(22, 'Grey Cement - STS'),
(23, 'Human Capital'),
(24, 'License to Operate'),
(25, 'Maintenance Strategic Management'),
(26, 'Maintenance System'),
(27, 'Marketing'),
(28, 'New Business'),
(29, 'Operation and Maintenance Service'),
(30, 'Operations'),
(31, 'Production & Service - กระบี่'),
(32, 'Production & Service - ชุมพร'),
(33, 'Production & Service - ถลาง'),
(34, 'Production & Service - นครศรีธรรมราช'),
(35, 'Production & Service - ภูเก็ต'),
(36, 'Production & Service - สงขลา'),
(37, 'Production & Service - สุราษฎร์ธานี'),
(38, 'Project'),
(39, 'Quarry'),
(40, 'RMC - South Chain'),
(41, 'Sales'),
(42, 'Smart Industrial Services-South'),
(43, 'Smart Maintenance Service'),
(44, 'South Chain'),
(45, 'Strategic People Management'),
(46, 'Value-Based Co-Creation');


-- --------------------------------------------------------

--
-- Table structure for table `tb_division`
--

CREATE TABLE `tb_division` (
  `division_id` int(1) NOT NULL,
  `division_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_division`
--

INSERT INTO `tb_division` (`division_id`, `division_name`) VALUES
(1, 'BSE South Chain'),
(2, 'Cement Plant - TS'),
(3, 'Co-Creation and Operation Development'),
(4, 'CPAC Solution Center กระบี่'),
(5, 'CPAC Solution Center นครศรีธรรมราช'),
(6, 'CPAC Solution Center ภูเก็ต'),
(7, 'CPAC Solution Center สงขลา'),
(8, 'CPAC Solution Center สุราษฎร์ธานี'),
(9, 'EPS'),
(10, 'Grey Cement - STS'),
(11, 'Industrial Expertise Service'),
(12, 'Research and Innovation Center'),
(13, 'RMC - South Chain'),
(14, 'Smart Industrial Services'),
(15, 'South Chain');



-- --------------------------------------------------------

--
-- Table structure for table `tb_position`
--

CREATE TABLE `tb_position` (
  `position_id` int(1) NOT NULL,
  `position_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_position`
--

INSERT INTO `tb_position` (`position_id`, `position_name`) VALUES
(1, 'Accounting Staff '),
(2, 'Accounting Supervisor'),
(3, 'Accounting Supervisor '),
(4, 'Administration Officer'),
(5, 'Assistant Manager Value-Based Co-Creation'),
(6, 'Associate Manager - Plant Maintenance'),
(7, 'Autonomous Maintenance Manager'),
(8, 'BSE Assistant Manager - AE CPAC Solution Center ภูเก็ต'),
(9, 'BSE Assistant Manager - AE CPAC Solution Center สุราษฎร์ธานี'),
(10, 'BSE Director-South Chain'),
(11, 'BSE Manager - AE CPAC Solution Center กระบี่'),
(12, 'BSE Manager - AE CPAC Solution Center นครศรีธรรมราช'),
(13, 'BSE Manager - AE CPAC Solution Center ภูเก็ต'),
(14, 'BSE Manager - AE CPAC Solution สงขลา'),
(15, 'BSE Manager - Contractor Management'),
(16, 'BSE Manager - Human Capital'),
(17, 'BSE Manager - License to Operate'),
(18, 'BSE Manager - Strategic People Management'),
(19, 'BSE Officer - Community & Government Relation'),
(20, 'BSE Officer - Contarctor Management'),
(21, 'BSE Officer - GRC'),
(22, 'BSE Officer - Human Capital'),
(23, 'BSE Officer - Safety & Environment'),
(24, 'BSE Officer - Strategic People Management'),
(25, 'Business Process Innovation & ID4.0 Assessment Director'),
(26, 'Co-Creation and Operation Development Assosiate Director'),
(27, 'Co-Creation and Operation Development Director'),
(28, 'Command Center Assisstant Manager'),
(29, 'Construction Estimator'),
(30, 'Construction Management Manager'),
(31, 'Construction Solution System & Process Manager'),
(32, 'CPAC - South Team Leader '),
(33, 'CS Operation Director'),
(34, 'Customer Value Executive'),
(35, 'Design and Engineering Assistant Manager'),
(36, 'Design and Engineering Manager'),
(37, 'Digital Transformation Assistant Manager'),
(38, 'Digital Transformation Manager'),
(39, 'Digital Transformation Officer'),
(40, 'Drawing and Eco-System Management Manager'),
(41, 'E2E Supply Chain Management Assistant Manager'),
(42, 'E2E Supply Chain Management Manager'),
(43, 'Electrical Maintenance Manager - Cement / Packer / SMC'),
(44, 'Electrical Maintenance Manager - Clusher/Raw Mill'),
(45, 'Electrical Maintenance Manager - Kiln / Coal / Alternative Fuel'),
(46, 'Electrical Technician'),
(47, 'Engineer'),
(48, 'Grey Cement - STS Team Leader '),
(49, 'Intrapreneur'),
(50, 'Job Controller'),
(51, 'Maintenance Manager - WHG / CFB / Power'),
(52, 'Maintenance Overhaul and Consultancy Manager'),
(53, 'Maintenance Overhaul and Consultancy Manager - Electrical'),
(54, 'Maintenance Overhaul and Consultancy Manager - Mechanical'),
(55, 'Maintenance Overhaul and Consultancy Manager - Refractory'),
(56, 'Maintenance Overhaul and Consultancy Supervisor - Mechanical'),
(57, 'Maintenance Overhaul and Consultancy Supervisor - Refractory'),
(58, 'Maintenance Overhaul and Consultancy Technician - Electrical'),
(59, 'Maintenance Overhaul and Consultancy Technician - Mechanical'),
(60, 'Maintenance Overhaul and Consultancy Technician - Refractory'),
(61, 'Maintenance Reliable Service Manager'),
(62, 'Maintenance Reliable Service Supervisor - South'),
(63, 'Maintenance Reliable Service Technician - South'),
(64, 'Maintenance Workshop Service Manager - South'),
(65, 'Maintenance Workshop Service Technician - Mechanical'),
(66, 'Managing Director-South Chain'),
(67, 'Marketing Manager'),
(68, 'Measurement and Analysis Technician'),
(69, 'Mechanical Maintenance Manager - Cement / Packer / SMC'),
(70, 'Mechanical Maintenance Manager - Crusher / Raw Mill'),
(71, 'Mechanical Maintenance Manager - Kiln / Coal / Alternative Fuel'),
(72, 'Mechanical Technician'),
(73, 'Modeler'),
(74, 'New Business Associate Director'),
(75, 'Operation and Maintenance Supervisor'),
(76, 'Operation and Maintenance Technical Sale Manager'),
(77, 'Operation and Maintenance Technical Sale Technician'),
(78, 'Operation and Maintenance Technician'),
(79, 'Plant Construction Assistant Manager'),
(80, 'Plant Construction Manager'),
(81, 'Plant Maintenance Manager'),
(82, 'Process Digitization Architect'),
(83, 'Project Manager'),
(84, 'Quarry Manager'),
(85, 'Security Management Manager'),
(86, 'Senior Accountant '),
(87, 'Shutdown and Inventory Management - Assosiated Manager'),
(88, 'Shutdown Maintenance Manager'),
(89, 'Site Assessment and Training Officer'),
(90, 'Smart Industrial Services Manager-Sout'),
(91, 'Technical and Maintenance Planning Supervisor'),
(92, 'Value-Based Co-Creation Manager'),
(93, 'Value-Based Co-Creation Staff'),
(94, 'เจ้าหน้าที่ Back Office Support Sales'),
(95, 'เจ้าหน้าที่ควบคุมคุณภาพ'),
(96, 'เจ้าหน้าที่ธุรการ'),
(97, 'เจ้าหน้าที่ประสานงานขาย'),
(98, 'นักการตลาด'),
(99, 'นักบริหารการตลาด'),
(100, 'นักวิชาการความปลอดภัยและอาชีวอนามัย'),
(101, 'ผู้จัดการ Administration & Procurement'),
(102, 'ผู้จัดการ CPAC Solution'),
(103, 'ผู้จัดการ Franchise 2'),
(104, 'ผู้จัดการ Franchise 3'),
(105, 'ผู้จัดการ Industry 4.0'),
(106, 'ผู้จัดการขาย'),
(107, 'ผู้จัดการความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม'),
(108, 'ผู้จัดการจัดเตรียมวัตถุดิบ'),
(109, 'ผู้จัดการซ่อมบำรุงจักรกลหนัก'),
(110, 'ผู้จัดการบรรจุและจ่ายซีเมนต์'),
(111, 'ผู้จัดการประกันคุณภาพ'),
(112, 'ผู้จัดการประจำ Operations'),
(113, 'ผู้จัดการประจำ Quarry'),
(114, 'ผู้จัดการผลิตซีเมนต์'),
(115, 'ผู้จัดการผลิตถุงปูนซีเมนต์'),
(116, 'ผู้จัดการผลิตปูนเม็ด TS4'),
(117, 'ผู้จัดการผลิตปูนเม็ด TS5'),
(118, 'ผู้จัดการผลิตปูนเม็ด TS6'),
(119, 'ผู้จัดการผลิตไฟฟ้า'),
(120, 'ผู้จัดการผลิตและบริการ - กระบี่'),
(121, 'ผู้จัดการผลิตและบริการ - ถลาง'),
(122, 'ผู้จัดการผลิตและบริการ - นครศรีธรรมราช'),
(123, 'ผู้จัดการผลิตและบริการ - ภูเก็ต'),
(124, 'ผู้จัดการผลิตและบริการ - สงขลา'),
(125, 'ผู้จัดการผลิตและบริการ - สุราษฎร์ธานี'),
(126, 'ผู้จัดการผลิตหินก่อนย่อย'),
(127, 'ผู้จัดการผลิตหินย่อยและหินก่อสร้าง'),
(128, 'ผู้จัดการพัสดุ'),
(129, 'ผู้จัดการระบบงานซ่อมบำรุง'),
(130, 'ผู้จัดการระบบซ่อมบำรุง'),
(131, 'ผู้จัดการวางแผนพัฒนาและฟื้นฟูเหมือง'),
(132, 'ผู้ช่วยผู้จัดการ Autonomous Maintenance'),
(133, 'ผู้ช่วยผู้จัดการ Biomass'),
(134, 'ผู้ช่วยผู้จัดการ CPAC Solution'),
(135, 'ผู้ช่วยผู้จัดการ Industry 4.0'),
(136, 'ผู้ช่วยผู้จัดการขาย'),
(137, 'ผู้ช่วยผู้จัดการความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม'),
(138, 'ผู้ช่วยผู้จัดการจัดเตรียมวัตถุดิบ'),
(139, 'ผู้ช่วยผู้จัดการชุมชนสัมพันธ์และรัฐกิจสัมพันธ์'),
(140, 'ผู้ช่วยผู้จัดการซ่อมบำรุงจักรกลหนัก'),
(141, 'ผู้ช่วยผู้จัดการตักและขนส่ง'),
(142, 'ผู้ช่วยผู้จัดการบรรจุและจ่ายซีเมนต์'),
(143, 'ผู้ช่วยผู้จัดการประกันคุณภาพ'),
(144, 'ผู้ช่วยผู้จัดการผลิตซีเมนต์'),
(145, 'ผู้ช่วยผู้จัดการผลิตถุงปูนซีเมนต์'),
(146, 'ผู้ช่วยผู้จัดการผลิตปูนเม็ด'),
(147, 'ผู้ช่วยผู้จัดการผลิตไฟฟ้า'),
(148, 'ผู้ช่วยผู้จัดการผลิตมอร์ตาร์'),
(149, 'ผู้ช่วยผู้จัดการผลิตหินย่อยและหินก่อสร้าง'),
(150, 'ผู้ช่วยผู้จัดการวางแผนพัฒนาและฟื้นฟูเหมือง'),
(151, 'ผู้ช่วยผู้จัดการวิเคราะห์และทดสอบ'),
(152, 'ผู้อานวยการกิจการ CPAC ภาคใต้'),
(153, 'ผู้อำนวยการ CPAC Solution Center - กระบี่'),
(154, 'ผู้อำนวยการ CPAC Solution Center - ภูเก็ต'),
(155, 'ผู้อำนวยการ CPAC Solution Center - สุราษฎร์ธานี'),
(156, 'ผู้อำนวยการโรงงานปูนทุ่งสง'),
(157, 'พนักงาน Autonomous Maintenance'),
(158, 'พนักงาน Back Office Support Sales'),
(159, 'พนักงาน Biomass'),
(160, 'พนักงาน Fuel and AFR'),
(161, 'พนักงาน Industry 4.0'),
(162, 'พนักงาน Purchasing & Raw Material Business'),
(163, 'พนักงานควบคุมคุณภาพ'),
(164, 'พนักงานควบคุมเครื่องย่อย'),
(165, 'พนักงานควบคุมจักรกลหนัก'),
(166, 'พนักงานจัดเตรียมวัตถุดิบ'),
(167, 'พนักงานซ่อมเครื่องจักร'),
(168, 'พนักงานซ่อมบำรุง'),
(169, 'พนักงานซ่อมบำรุงจักรกลหนัก'),
(170, 'พนักงานตรวจและวิเคราะห์ '),
(171, 'พนักงานธุรการ'),
(172, 'พนักงานบรรจุและจ่ายซีเมนต์'),
(173, 'พนักงานบริการเทคนิค'),
(174, 'พนักงานบริการลูกค้า'),
(175, 'พนักงานประกันคุณภาพ'),
(176, 'พนักงานผลิตซีเมนต์'),
(177, 'พนักงานผลิตถุงปูนซีเมนต์'),
(178, 'พนักงานผลิตปูนเม็ด'),
(179, 'พนักงานผลิตไฟฟ้า'),
(180, 'พนักงานผลิตมอร์ตาร์'),
(181, 'พนักงานผลิตโรงงานกระบี่แอร์พอร์ต'),
(182, 'พนักงานผลิตโรงงานกะทู้'),
(183, 'พนักงานผลิตโรงงานฉลอง'),
(184, 'พนักงานผลิตโรงงานเชิงทะเล 2'),
(185, 'พนักงานผลิตโรงงานทุ่งสง'),
(186, 'พนักงานผลิตโรงงานปุณณกันต์'),
(187, 'พนักงานผลิตโรงงานภูเก็ต'),
(188, 'พนักงานผลิตโรงงานภูเก็ต 2'),
(189, 'พนักงานผลิตโรงงานแม่ขรี - พัทลุง'),
(190, 'พนักงานผลิตโรงงานรัตภูมิ 2'),
(191, 'พนักงานผลิตโรงงานศรีวิชัย'),
(192, 'พนักงานผลิตโรงงานศรีสุราษฎร์'),
(193, 'พนักงานผลิตโรงงานสงขลา - ขุนทอง'),
(194, 'พนักงานผลิตโรงงานสนามบินตรัง'),
(195, 'พนักงานผลิตโรงงานสาคู'),
(196, 'พนักงานผลิตโรงงานสุราษฎร์ธานี'),
(197, 'พนักงานผลิตโรงงานหาดใหญ่ 4'),
(198, 'พนักงานผลิตโรงงานแหลมพันวา'),
(199, 'พนักงานพัสดุคงคลัง'),
(200, 'พนักงานพัสดุจัดหา'),
(201, 'พนักงานฟื้นฟูเหมือง'),
(202, 'พนักงานรับจ่ายงาน'),
(203, 'พนักงานโรงงานสงขลา - นาทวี'),
(204, 'พนักงานวิเคราะห์และทดสอบ'),
(205, 'พนักงานเหมืองแร่'),
(206, 'วิศวกร'),
(207, 'วิศวกรสิ่งแวดล้อม'),
(208, 'วิศวกรอาวุโส'),
(209, 'หัวหน้าโรงงานกระบี่'),
(210, 'หัวหน้าโรงงานชุมพร'),
(211, 'หัวหน้าโรงงานตะกั่วป่า'),
(212, 'หัวหน้าโรงงานนครศรีธรรมราช'),
(213, 'หัวหน้าโรงงานนครศรีธรรมราช 2'),
(214, 'หัวหน้าโรงงานพัทลุง'),
(215, 'หัวหน้าโรงงานเวียงสระ'),
(216, 'หัวหน้าโรงงานศรีตรัง'),
(217, 'หัวหน้าโรงงานศรีวิชัย'),
(218, 'หัวหน้าโรงงานสงขลา'),
(219, 'หัวหน้าโรงงานสุราษฎร์ธานี'),
(220, 'หัวหน้าโรงงานสุราษฎร์ธานี - เซาท์เทิร์น'),
(221, 'หัวหน้าโรงงานหาดใหญ่ 2'),
(222, 'หัวหน้าศูนย์รับจ่ายงานและบริการปั๊ม'),
(223, 'หัวหน้าสารบรรณ');

-- --------------------------------------------------------

--
-- Table structure for table `tb_project_type`
--

CREATE TABLE `tb_project_type` (
  `pjt_id` int(11) NOT NULL COMMENT 'Project Type ID',
  `pjt_name` varchar(100) NOT NULL COMMENT 'Project Type Name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_project_type`
--

INSERT INTO `tb_project_type` (`pjt_id`, `pjt_name`) VALUES
(1, 'Piece Work'),
(2, '- Work');

-- --------------------------------------------------------

--
-- Table structure for table `tb_section`
--

CREATE TABLE `tb_section` (
  `section_id` int(1) NOT NULL,
  `section_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_section`
--

INSERT INTO `tb_section` (`section_id`, `section_name`) VALUES
(1, 'Administration & Procurement'),
(2, 'Advance Measurement & Analysis'),
(3, 'Autonomous Maintenance'),
(4, 'Biomass'),
(5, 'BSE - CSC'),
(6, 'BSE South Chain'),
(7, 'Cement Plant - TS'),
(8, 'Co-Creation and Operation Development'),
(9, 'Community & Government Relation'),
(10, 'Construction Management'),
(11, 'Construction Solution System & Process'),
(12, 'Contractor Management'),
(13, 'CPAC Solution'),
(14, 'CPAC Solution Center กระบี่'),
(15, 'CPAC Solution Center ภูเก็ต'),
(16, 'CPAC Solution Center สุราษฎร์ธานี'),
(17, 'CS Operation'),
(18, 'Design and Engineering'),
(19, 'Design Solution and Execution -South'),
(20, 'Digital Transformation'),
(21, 'Dispatch'),
(22, 'Drawing and Eco-System Management'),
(23, 'E2E Supply Chain'),
(24, 'Franchise 2'),
(25, 'Franchise 3'),
(26, 'Fuel and AFR'),
(27, 'Grey Cement - STS'),
(28, 'Human Capital'),
(29, 'Industry 4.0'),
(30, 'LAB TS'),
(31, 'License to Operate'),
(32, 'Maintenance Overhaul and Consultancy'),
(33, 'Maintenance Reliable Service'),
(34, 'Maintenance Strategic Management'),
(35, 'Maintenance System'),
(36, 'Maintenance Workshop Service - South'),
(37, 'Marketing'),
(38, 'New Business'),
(39, 'Operation RMC'),
(40, 'Operations'),
(41, 'Plant Maintenance'),
(42, 'Production & Service - กระบี่'),
(43, 'Production & Service - ถลาง'),
(44, 'Production & Service - นครศรีธรรมราช'),
(45, 'Production & Service - ภูเก็ต'),
(46, 'Production & Service - สงขลา'),
(47, 'Production & Service - สุราษฎร์ธานี'),
(48, 'Project'),
(49, 'Quality Assurance'),
(50, 'Quarry'),
(51, 'RMC - South Chain'),
(52, 'Safety & Environment'),
(53, 'Sales'),
(54, 'Smart Industrial Services-South'),
(55, 'South Chain'),
(56, 'Strategic People Management'),
(57, 'Value-Based Co-Creation'),
(58, 'จัดเตรียมวัตถุดิบ'),
(59, 'ซ่อมบำรุงจักรกลหนัก'),
(60, 'บรรจุและจ่ายซีเมนต์'),
(61, 'บริการลูกค้า'),
(62, 'ผลิตซีเมนต์'),
(63, 'ผลิตถุงปูนซีเมนต์'),
(64, 'ผลิตปูนเม็ด TS4'),
(65, 'ผลิตปูนเม็ด TS5'),
(66, 'ผลิตปูนเม็ด TS6'),
(67, 'ผลิตไฟฟ้า'),
(68, 'ผลิตมอร์ตาร์'),
(69, 'ผลิตหินก่อนย่อย'),
(70, 'ผลิตหินย่อยและหินก่อสร้าง'),
(71, 'พัสดุ'),
(72, 'วางแผนพัฒนาและฟื้นฟูเหมือง'),
(73, 'ศูนย์ทดสอบ'),
(74, 'ศูนย์ทดสอบ - กระบี่'),
(75, 'ศูนย์ทดสอบ นครศรีธรรมราช'),
(76, 'ศูนย์ทดสอบ ภูเก็ต');

-- --------------------------------------------------------

--
-- Table structure for table `tb_vendor_type`
--

CREATE TABLE `tb_vendor_type` (
  `vt_id` int(11) NOT NULL COMMENT 'Vendor Type ID',
  `vt_name` varchar(100) NOT NULL COMMENT 'Vendor Type Name',
  `vt_hex` varchar(100) NOT NULL COMMENT 'HEX Color Code'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_vendor_type`
--

INSERT INTO `tb_vendor_type` (`vt_id`, `vt_name`, `vt_hex`) VALUES
(1, 'หจก. ที่ขึ้นทะเบียนไว้แล้ว', '#008000'),
(2, 'หจก. นอก list', '#ffa500');

-- --------------------------------------------------------

--
-- Table structure for table `tb_work_type`
--

CREATE TABLE `tb_work_type` (
  `wt_id` int(11) NOT NULL,
  `wt_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_work_type`
--

INSERT INTO `tb_work_type` (`wt_id`, `wt_name`) VALUES
(1, 'งานก่อสร้าง');

-- --------------------------------------------------------

--
-- Table structure for table `user_staff`
--

CREATE TABLE `user_staff` (
  `s_id` int(11) NOT NULL COMMENT 'Staff ID',
  `s_fname` varchar(50) NOT NULL,
  `s_lname` varchar(50) NOT NULL,
  `s_position` varchar(100) NOT NULL,
  `s_tel` varchar(10) NOT NULL,
  `s_email` varchar(100) NOT NULL,
  `po_id` int(11) NOT NULL COMMENT 'Position ID',
  `div_id` int(11) NOT NULL COMMENT 'Division ID',
  `dept_id` int(11) NOT NULL COMMENT 'Department ID',
  `sec_id` int(11) NOT NULL COMMENT 'Section ID',
  `roleId` int(11) NOT NULL,
  `admin_permission` tinyint(1) NOT NULL DEFAULT 0,
  `reset_pwd_req` tinyint(1) NOT NULL DEFAULT 0,
  `employee_id` varchar(10) NOT NULL,
  `s_password` varchar(100) NOT NULL,
  `login_otp` varchar(6) DEFAULT NULL COMMENT 'OTP For Work Owner Login Only',
  `ustatus_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_staff`
--

INSERT INTO `user_staff` (`s_id`, `s_fname`, `s_lname`, `s_position`, `s_tel`, `s_email`, `po_id`, `div_id`, `dept_id`, `sec_id`, `roleId`, `admin_permission`, `reset_pwd_req`, `employee_id`, `s_password`, `login_otp`, `ustatus_id`) VALUES
(1, 'Thiraphat', 'Sangchai', '1', '0895889955', 'zeroplus115@gmail.com', 1, 1, 1, 1, 4, 0, 0, '6240011015', '12345', '367589', 1),
(2, 'Adam', 'Smash', '1', '0895889955', 'zeroplus114@gmail.com', 1, 1, 1, 1, 5, 0, 0, '6240011016', '12345', NULL, 1),
(3, 'REE', 'RAA', '1', '1', 'zeroplus114@gmail.com', 1, 1, 1, 1, 5, 0, 0, '6240011017', '12', NULL, 1),
(4, 'John', 'Does', 'a', '0895889955', 'zeroplus114@gmail.com', 1, 1, 1, 1, 5, 0, 0, '100', '100', NULL, 1),
(5, 'Is', 'Join', '1', '0895889955', 'zeroplus114@gmail.com', 1, 1, 1, 1, 5, 0, 0, '200', '1', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_vendor`
--

CREATE TABLE `user_vendor` (
  `v_id` int(11) NOT NULL COMMENT 'Vendor ID',
  `v_fname` varchar(50) NOT NULL,
  `v_lname` varchar(50) NOT NULL,
  `v_position` varchar(100) NOT NULL,
  `v_tel` varchar(10) NOT NULL,
  `v_email` varchar(100) NOT NULL,
  `v_co` varchar(100) NOT NULL COMMENT 'Vendor Company Name',
  `v_co_location` varchar(100) NOT NULL COMMENT 'Vendor Company Location',
  `v_register_date` date NOT NULL,
  `v_register_time` time NOT NULL,
  `vt_id` int(11) NOT NULL COMMENT 'Vendor Type ID',
  `v_password` varchar(100) NOT NULL,
  `reset_pwd_req` tinyint(1) NOT NULL,
  `ustatus_id` int(11) NOT NULL COMMENT 'User Status ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_vendor`
--

INSERT INTO `user_vendor` (`v_id`, `v_fname`, `v_lname`, `v_position`, `v_tel`, `v_email`, `v_co`, `v_co_location`, `v_register_date`, `v_register_time`, `vt_id`, `v_password`, `reset_pwd_req`, `ustatus_id`) VALUES
(1, '5', '5', '1', '1', 'aa@aa.com', '1', '1', '2023-04-08', '11:37:54', 1, '11', 0, 1),
(2, 'Thiraphat', 'Sangchai', 'Developer', '0895889955', 'thiraphat@mail.com', 'Test Company', 'Test Location', '2023-04-25', '11:29:58', 2, '$2y$12$/0oHb/FNsk/buDy2kuy5EOj30efu5.wsOgA80zvgbgGx2XPLtl8fy', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bidder`
--
ALTER TABLE `bidder`
  ADD PRIMARY KEY (`bidder_id`);

--
-- Indexes for table `bidding`
--
ALTER TABLE `bidding`
  ADD PRIMARY KEY (`biding_id`);

--
-- Indexes for table `bidding_negotiate`
--
ALTER TABLE `bidding_negotiate`
  ADD PRIMARY KEY (`negotiate_id`);

--
-- Indexes for table `bidding_negotiate_sub`
--
ALTER TABLE `bidding_negotiate_sub`
  ADD PRIMARY KEY (`sub_id`);

--
-- Indexes for table `bidding_sub`
--
ALTER TABLE `bidding_sub`
  ADD PRIMARY KEY (`sub_id`);

--
-- Indexes for table `committee`
--
ALTER TABLE `committee`
  ADD PRIMARY KEY (`committee_id`);

--
-- Indexes for table `committee_envelope`
--
ALTER TABLE `committee_envelope`
  ADD PRIMARY KEY (`open_id`);

--
-- Indexes for table `envelope_group`
--
ALTER TABLE `envelope_group`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `envelope_group_setting`
--
ALTER TABLE `envelope_group_setting`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `generate_log`
--
ALTER TABLE `generate_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `log_committee_accept`
--
ALTER TABLE `log_committee_accept`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `log_project_approve`
--
ALTER TABLE `log_project_approve`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `log_project_finish_approve`
--
ALTER TABLE `log_project_finish_approve`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `log_project_sub_approve`
--
ALTER TABLE `log_project_sub_approve`
  ADD PRIMARY KEY (`approval_id`);

--
-- Indexes for table `log_vendor_approve`
--
ALTER TABLE `log_vendor_approve`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`pj_id`);

--
-- Indexes for table `project_join_setting`
--
ALTER TABLE `project_join_setting`
  ADD PRIMARY KEY (`pj_id`);

--
-- Indexes for table `project_sub_approver`
--
ALTER TABLE `project_sub_approver`
  ADD PRIMARY KEY (`psa_id`);

--
-- Indexes for table `project_sub_auction`
--
ALTER TABLE `project_sub_auction`
  ADD PRIMARY KEY (`sub_id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`roleId`,`role`);

--
-- Indexes for table `status_bid`
--
ALTER TABLE `status_bid`
  ADD PRIMARY KEY (`bstatus_id`);

--
-- Indexes for table `status_committee`
--
ALTER TABLE `status_committee`
  ADD PRIMARY KEY (`cstatus_id`);

--
-- Indexes for table `status_project`
--
ALTER TABLE `status_project`
  ADD PRIMARY KEY (`pstatus_id`);

--
-- Indexes for table `status_user`
--
ALTER TABLE `status_user`
  ADD PRIMARY KEY (`ustatus_id`);

--
-- Indexes for table `tb_arole`
--
ALTER TABLE `tb_arole`
  ADD PRIMARY KEY (`arole_id`);

--
-- Indexes for table `tb_company`
--
ALTER TABLE `tb_company`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `tb_crole`
--
ALTER TABLE `tb_crole`
  ADD PRIMARY KEY (`crole_id`);

--
-- Indexes for table `tb_department`
--
ALTER TABLE `tb_department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `tb_division`
--
ALTER TABLE `tb_division`
  ADD PRIMARY KEY (`division_id`);

--
-- Indexes for table `tb_position`
--
ALTER TABLE `tb_position`
  ADD PRIMARY KEY (`position_id`);

--
-- Indexes for table `tb_project_type`
--
ALTER TABLE `tb_project_type`
  ADD PRIMARY KEY (`pjt_id`);

--
-- Indexes for table `tb_section`
--
ALTER TABLE `tb_section`
  ADD PRIMARY KEY (`section_id`);

--
-- Indexes for table `tb_vendor_type`
--
ALTER TABLE `tb_vendor_type`
  ADD PRIMARY KEY (`vt_id`);

--
-- Indexes for table `tb_work_type`
--
ALTER TABLE `tb_work_type`
  ADD PRIMARY KEY (`wt_id`);

--
-- Indexes for table `user_staff`
--
ALTER TABLE `user_staff`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `user_vendor`
--
ALTER TABLE `user_vendor`
  ADD PRIMARY KEY (`v_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bidder`
--
ALTER TABLE `bidder`
  MODIFY `bidder_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bidding`
--
ALTER TABLE `bidding`
  MODIFY `biding_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bidding_negotiate`
--
ALTER TABLE `bidding_negotiate`
  MODIFY `negotiate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bidding_negotiate_sub`
--
ALTER TABLE `bidding_negotiate_sub`
  MODIFY `sub_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bidding_sub`
--
ALTER TABLE `bidding_sub`
  MODIFY `sub_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `committee`
--
ALTER TABLE `committee`
  MODIFY `committee_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `committee_envelope`
--
ALTER TABLE `committee_envelope`
  MODIFY `open_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `envelope_group`
--
ALTER TABLE `envelope_group`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `envelope_group_setting`
--
ALTER TABLE `envelope_group_setting`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generate_log`
--
ALTER TABLE `generate_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_committee_accept`
--
ALTER TABLE `log_committee_accept`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_project_approve`
--
ALTER TABLE `log_project_approve`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_project_finish_approve`
--
ALTER TABLE `log_project_finish_approve`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_project_sub_approve`
--
ALTER TABLE `log_project_sub_approve`
  MODIFY `approval_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `log_vendor_approve`
--
ALTER TABLE `log_vendor_approve`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_sub_approver`
--
ALTER TABLE `project_sub_approver`
  MODIFY `psa_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `project_sub_auction`
--
ALTER TABLE `project_sub_auction`
  MODIFY `sub_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `role_user`
--
ALTER TABLE `role_user`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `status_bid`
--
ALTER TABLE `status_bid`
  MODIFY `bstatus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `status_committee`
--
ALTER TABLE `status_committee`
  MODIFY `cstatus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `status_project`
--
ALTER TABLE `status_project`
  MODIFY `pstatus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `status_user`
--
ALTER TABLE `status_user`
  MODIFY `ustatus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_arole`
--
ALTER TABLE `tb_arole`
  MODIFY `arole_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Approver Role ID', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_company`
--
ALTER TABLE `tb_company`
  MODIFY `company_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_crole`
--
ALTER TABLE `tb_crole`
  MODIFY `crole_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Committee Role ID', AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_department`
--
ALTER TABLE `tb_department`
  MODIFY `department_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `tb_division`
--
ALTER TABLE `tb_division`
  MODIFY `division_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tb_position`
--
ALTER TABLE `tb_position`
  MODIFY `position_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `tb_project_type`
--
ALTER TABLE `tb_project_type`
  MODIFY `pjt_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Project Type ID', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_section`
--
ALTER TABLE `tb_section`
  MODIFY `section_id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `tb_vendor_type`
--
ALTER TABLE `tb_vendor_type`
  MODIFY `vt_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Vendor Type ID', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_work_type`
--
ALTER TABLE `tb_work_type`
  MODIFY `wt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_staff`
--
ALTER TABLE `user_staff`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Staff ID', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_vendor`
--
ALTER TABLE `user_vendor`
  MODIFY `v_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Vendor ID', AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
