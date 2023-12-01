/*
  Warnings:

  - You are about to drop the column `Image` on the `roomImages` table. All the data in the column will be lost.
  - The values [DROM,SINGLE] on the enum `rooms_category` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `image` to the `roomImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `roomImages` DROP COLUMN `Image`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `rooms` MODIFY `category` ENUM('DORM', 'PRIVATE') NOT NULL;
