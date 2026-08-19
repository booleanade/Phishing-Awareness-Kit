export const SQL_SCHEMA = `-- ==========================================================
-- Phishing Awareness Kit Database Schema
-- Database: phishing_awareness
-- Compatibility: MySQL 5.7+ / MySQL 8.0 / MariaDB 10.3+
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS \`phishing_awareness\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`phishing_awareness\`;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('staff', 'admin') NOT NULL DEFAULT 'staff',
  \`department\` ENUM('ICT', 'HR', 'Finance', 'Administration', 'Operations') NOT NULL DEFAULT 'ICT',
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_user_email\` (\`email\`),
  INDEX \`idx_user_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`lessons\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`lessons\`;
CREATE TABLE IF NOT EXISTS \`lessons\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`order_number\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`status\` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_lesson_order\` (\`order_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`quizzes\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`quizzes\`;
CREATE TABLE IF NOT EXISTS \`quizzes\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`assessment_type\` ENUM('pre_test', 'quiz', 'post_test') NOT NULL DEFAULT 'quiz',
  \`question\` TEXT NOT NULL,
  \`option_a\` VARCHAR(255) NOT NULL,
  \`option_b\` VARCHAR(255) NOT NULL,
  \`option_c\` VARCHAR(255) NOT NULL,
  \`option_d\` VARCHAR(255) NOT NULL,
  \`correct_answer\` ENUM('a', 'b', 'c', 'd') NOT NULL,
  \`explanation\` TEXT NOT NULL,
  \`lesson_id\` INT UNSIGNED NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`idx_quiz_type\` (\`assessment_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`quiz_attempts\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`quiz_attempts\`;
CREATE TABLE IF NOT EXISTS \`quiz_attempts\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`assessment_type\` ENUM('pre_test', 'quiz', 'post_test') NOT NULL,
  \`score\` INT NOT NULL,
  \`total_questions\` INT NOT NULL DEFAULT 10,
  \`percentage\` DECIMAL(5,2) NOT NULL,
  \`passed\` TINYINT(1) NOT NULL DEFAULT 0,
  \`completed_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_attempt_user\` (\`user_id\`, \`assessment_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`simulations\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`simulations\`;
CREATE TABLE IF NOT EXISTS \`simulations\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`difficulty\` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  \`sender_name\` VARCHAR(150) NOT NULL,
  \`sender_email\` VARCHAR(150) NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`message_html\` LONGTEXT NOT NULL,
  \`is_phishing\` TINYINT(1) NOT NULL DEFAULT 1,
  \`warning_signs\` TEXT NOT NULL,
  \`explanation\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`simulation_attempts\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`simulation_attempts\`;
CREATE TABLE IF NOT EXISTS \`simulation_attempts\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`simulation_id\` INT UNSIGNED NOT NULL,
  \`selected_answer\` ENUM('phishing', 'legitimate') NOT NULL,
  \`is_correct\` TINYINT(1) NOT NULL,
  \`completed_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`simulation_id\` ) REFERENCES \`simulations\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`reports\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`reports\`;
CREATE TABLE IF NOT EXISTS \`reports\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`sender_address\` VARCHAR(150) NOT NULL,
  \`suspicious_details\` TEXT NOT NULL,
  \`urgency_level\` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  \`simulation_id\` INT UNSIGNED NULL,
  \`is_simulated_campaign\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` ENUM('Pending Review', 'Investigating', 'Confirmed Phish', 'Simulated Test', 'False Positive') NOT NULL DEFAULT 'Pending Review',
  \`admin_notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table \`user_lesson_progress\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`user_lesson_progress\`;
CREATE TABLE IF NOT EXISTS \`user_lesson_progress\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`lesson_id\` INT UNSIGNED NOT NULL,
  \`completed_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_user_lesson\` (\`user_id\`, \`lesson_id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Initial Seed Data
-- --------------------------------------------------------

-- Default Admin & Staff Accounts (passwords hashed with PHP password_hash default BCRYPT)
-- Password for all seed users: Password123!
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`department\`, \`status\`) VALUES
(1, 'Alex Vance (SecOps Lead)', 'admin.secops@company.test', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'admin', 'ICT', 'active'),
(2, 'John Doe', 'john.doe@company.test', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'staff', 'Finance', 'active'),
(3, 'Mary Smith', 'mary.smith@company.test', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'staff', 'HR', 'active'),
(4, 'David James', 'david.james@company.test', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'staff', 'ICT', 'active'),
(5, 'Sarah Williams', 'sarah.williams@company.test', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'staff', 'Administration', 'active');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;

export const PHP_FILES = {
  'config/database.php': `<?php
/**
 * Database Connection using PDO
 * Phishing Awareness Kit
 */
declare(strict_types=1);

// Database configuration settings
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'phishing_awareness');
define('DB_USER', getenv('DB_USER') ?: 'pak_user');
define('DB_PASS', getenv('DB_PASS') ?: 'SecurePassword2026!');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_CHARSET', 'utf8mb4');

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // In production, never output raw database credentials or trace
                error_log("Database Connection Error: " . $e->getMessage());
                die("A secure database error occurred. Please contact the system administrator.");
            }
        }
        return self::$instance;
    }
}
`,

  'config/app.php': `<?php
/**
 * Application Configuration & Security Constants
 */
declare(strict_types=1);

define('APP_NAME', 'Phishing Awareness Kit');
define('APP_ENV', getenv('APP_ENV') ?: 'production');
define('APP_URL', getenv('APP_URL') ?: 'https://phishing-awareness.example.com');
define('PASSING_SCORE_THRESHOLD', 70); // 70% passing requirement
define('SESSION_LIFETIME', 3600); // 1 hour timeout

// Secure Session Initialization
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Strict');
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', '1');
    }
    ini_set('session.use_strict_mode', '1');
    session_start();
}
`,

  '.htaccess': `# ==========================================================
# Apache Security and Rewrite Configuration
# Phishing Awareness Kit
# ==========================================================

# Force HTTPS Redirect
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Prevent Directory Browsing
Options -Indexes

# Block Access to Sensitive Files
<FilesMatch "^(database\.php|\.env|\.git|composer\.json|phishing_awareness\.sql)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline';"
</IfModule>
`,

  'auth/authenticate.php': `<?php
/**
 * Secure Authentication Controller
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/app.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        header("Location: ../index.php?error=empty_fields");
        exit;
    }

    $pdo = Database::getConnection();
    $stmt = $pdo->prepare("SELECT id, name, email, password, role, department, status FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        if ($user['status'] !== 'active') {
            header("Location: ../index.php?error=inactive_account");
            exit;
        }

        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_department'] = $user['department'];
        $_SESSION['last_activity'] = time();

        if ($user['role'] === 'admin') {
            header("Location: ../admin/dashboard.php");
        } else {
            header("Location: ../staff/dashboard.php");
        }
        exit;
    } else {
        header("Location: ../index.php?error=invalid_credentials");
        exit;
    }
}
`,

  'staff/dashboard.php': `<?php
/**
 * Staff Dashboard View
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/app.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'staff') {
    header("Location: ../index.php?error=unauthorized");
    exit;
}

$userId = $_SESSION['user_id'];
$pdo = Database::getConnection();

// Fetch Pre-Test & Post-Test Scores
$stmt = $pdo->prepare("SELECT assessment_type, percentage FROM quiz_attempts WHERE user_id = :uid ORDER BY completed_at DESC");
$stmt->execute([':uid' => $userId]);
$attempts = $stmt->fetchAll();

// Fetch Completed Lessons Count
$stmt = $pdo->prepare("SELECT COUNT(*) as completed_lessons FROM user_lesson_progress WHERE user_id = :uid");
$stmt->execute([':uid' => $userId]);
$lessonStats = $stmt->fetch();

// Fetch Simulation Stats
$stmt = $pdo->prepare("SELECT COUNT(*) as total_sims, SUM(is_correct) as correct_sims FROM simulation_attempts WHERE user_id = :uid");
$stmt->execute([':uid' => $userId]);
$simStats = $stmt->fetch();

$recognitionRate = ($simStats['total_sims'] > 0) ? round(($simStats['correct_sims'] / $simStats['total_sims']) * 100) : 0;
?>
<!-- Responsive HTML/Bootstrap 5 Staff Dashboard View -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Dashboard - Phishing Awareness Kit</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body class="bg-light">
    <!-- Navbar & Staff Metrics Cards Rendered Here -->
    <div class="container py-4">
        <h2>Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?></h2>
        <p class="text-muted">Department: <?= htmlspecialchars($_SESSION['user_department']) ?></p>
        <!-- Training metrics & action buttons -->
    </div>
</body>
</html>
`
};

export const DEPLOYMENT_FILES = {
  schema: {
    filename: 'database.sql',
    content: SQL_SCHEMA,
    description: 'Complete MySQL schema with tables for users, lessons, quizzes, simulations, reports, and seed data.'
  },
  db_config: {
    filename: 'config/database.php',
    content: PHP_FILES['config/database.php'],
    description: 'Secure PDO database singleton connection with error logging and utf8mb4 encoding.'
  },
  htaccess: {
    filename: '.htaccess',
    content: PHP_FILES['.htaccess'],
    description: 'Apache configuration for HTTPS enforcement, security headers (CSP, X-Frame-Options), and sensitive file denial.'
  },
  readme: {
    filename: 'DEPLOYMENT.md',
    content: `# Phishing Awareness Kit - Production Deployment Guide

## System Requirements
- PHP 8.2 or higher (with \`pdo_mysql\`, \`mbstring\`, \`openssl\` extensions enabled)
- MySQL 5.7+ / MySQL 8.0 or MariaDB 10.3+
- Apache Web Server with \`mod_rewrite\` and \`mod_headers\` enabled

## Step 1: Database Setup
1. Create a MySQL database (e.g. \`phishing_awareness\`) and a dedicated user.
2. Import \`database.sql\` via phpMyAdmin or MySQL CLI:
   \`\`\`bash
   mysql -u pak_user -p phishing_awareness < database.sql
   \`\`\`

## Step 2: Configure Environment
1. Edit \`config/database.php\` and supply your database credentials (\`DB_HOST\`, \`DB_NAME\`, \`DB_USER\`, \`DB_PASS\`).
2. Alternatively, set environment variables in your server or \`.htaccess\`.

## Step 3: Web Server Configuration
1. Place the project files in your web root (e.g. \`/public_html\` or \`/var/www/html\`).
2. Ensure \`.htaccess\` is active and \`AllowOverride All\` is enabled in Apache.

## Step 4: Default Administrator Login
- **Email**: \`admin.secops@company.test\`
- **Password**: \`Password123!\`
*(Change password immediately upon first login).*
`,
    description: 'Detailed instructions for deploying on cPanel, XAMPP, LAMP, or standard shared web hosting.'
  }
};

