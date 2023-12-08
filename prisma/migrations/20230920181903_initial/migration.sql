-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `token` VARCHAR(100) NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `criteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criteria_name` VARCHAR(100) NOT NULL,
    `criteria_code` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_criteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_criteria_name` VARCHAR(100) NOT NULL,
    `sub_criteria_score` INTEGER NOT NULL,
    `criteria_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alternative` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alternative_name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `accumulation_score` DOUBLE NULL,
    `rank` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alternative_scores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alternative_id` INTEGER NOT NULL,
    `criteria_id` INTEGER NOT NULL,
    `subcriteria_id` INTEGER NOT NULL,
    `distance_score` DOUBLE NULL,
    `besson_rank` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `result_name` VARCHAR(100) NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `username` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alternative_name` VARCHAR(100) NOT NULL,
    `rank` INTEGER NOT NULL,
    `results_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `criteria` ADD CONSTRAINT `criteria_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_criteria` ADD CONSTRAINT `sub_criteria_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alternative` ADD CONSTRAINT `alternative_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alternative_scores` ADD CONSTRAINT `alternative_scores_alternative_id_fkey` FOREIGN KEY (`alternative_id`) REFERENCES `alternative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alternative_scores` ADD CONSTRAINT `alternative_scores_criteria_id_fkey` FOREIGN KEY (`criteria_id`) REFERENCES `criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alternative_scores` ADD CONSTRAINT `alternative_scores_subcriteria_id_fkey` FOREIGN KEY (`subcriteria_id`) REFERENCES `sub_criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `result` ADD CONSTRAINT `result_results_id_fkey` FOREIGN KEY (`results_id`) REFERENCES `results`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
