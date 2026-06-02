-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_event_id_fkey";

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
