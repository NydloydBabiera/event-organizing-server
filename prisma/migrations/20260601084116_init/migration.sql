/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_user_id_key" ON "Event"("user_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
