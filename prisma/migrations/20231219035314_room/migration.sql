/*
  Warnings:

  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomFacilitiesRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RoomFacilitiesRelation` DROP FOREIGN KEY `RoomFacilitiesRelation_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `RoomImages` DROP FOREIGN KEY `RoomImages_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `_RoomFacilitiesRelation` DROP FOREIGN KEY `_RoomFacilitiesRelation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RoomFacilitiesRelation` DROP FOREIGN KEY `_RoomFacilitiesRelation_B_fkey`;

-- DropTable
DROP TABLE `Room`;

-- DropTable
DROP TABLE `_RoomFacilitiesRelation`;

-- CreateTable
CREATE TABLE `Rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomNumber` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `type` ENUM('DORM', 'PRIVATE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `checkin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `checkout` DATETIME(3) NOT NULL,
    `guestTotal` INTEGER NOT NULL,
    `status` ENUM('pending', 'complete') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomFacilitiesRelation` ADD CONSTRAINT `RoomFacilitiesRelation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomImages` ADD CONSTRAINT `RoomImages_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
