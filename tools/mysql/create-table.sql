CREATE TABLE IF NOT EXISTS `users`(
    `first_name` varchar(256) NOT NULL,
    `last_name` varchar(256) NOT NULL,
    `email` varchar(256) NOT NULL,
    `salt` varchar(32) NOT NULL,
    `hashed_password` varchar(64) NOT NULL,
    `is_administrator` boolean,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`email`),
    INDEX `idx_is_administrator` (`is_administrator`)
) ENGINE = innoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `images`(
    `id` binary(16) NOT NULL,
    `original_url` varchar(256) NOT NULL,
    `alt` varchar(256) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_alt` (`alt`)
) ENGINE = innoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `merchandise`(
    `slug` varchar(256) NOT NULL,
    `title` varchar(256) NOT NULL,
    `description` text NOT NULL,
    `image_id` binary(16) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`slug`),
    FOREIGN KEY (`image_id`) REFERENCES `images`(`id`),
    INDEX `idx_title` (`title`)
) ENGINE = innoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `art` (
    `slug` varchar(256) NOT NULL,
    `title` varchar(256) NOT NULL,
    `description` text NOT NULL,
    `series` varchar(256) NOT NULL,
    `height` int NOT NULL,
    `width` int NOT NULL,
    `medium` varchar(256) NOT NULL,
    `material` varchar(256) NOT NULL,
    `image_id` binary(16) NOT NULL,
    `styles` varchar(256),
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`slug`),
    FOREIGN KEY (`image_id`) REFERENCES `images`(`id`),
    INDEX `idx_title` (`title`)
) ENGINE = innoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;