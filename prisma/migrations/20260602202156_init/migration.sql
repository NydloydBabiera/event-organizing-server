-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_event_id_fkey";

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
