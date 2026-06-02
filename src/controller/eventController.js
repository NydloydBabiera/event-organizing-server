const prisma = require("../prisma");

const createEvent = async (req, res) => {
  try {
    const { name, venue, dateSchedule, user_id } = req.body;
    console.log("🚀 ~ createEvent ~ req.body:", req.body);
    const event = await prisma.event.create({
      data: {
        name,
        venue,
        date_schedule: new Date(dateSchedule).toISOString(),
        user_id,
      },
    });
    console.log("🚀 ~ createEvent ~ event:", event);

    res.status(201).json({
      message: "Event created",
      event,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getEventByHost = async (req, res) => {
  try {
    const { host_id } = req.params;
    const events = await prisma.event.findMany({
      where: {
        host_id,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, venue, dateSchedule } = req.body;
    const event = await prisma.event.update({
      where: { id },
      data: {
        name,
        venue,
        date_schedule: new Date(dateSchedule).toISOString(),
      },
    });
    res.json({
      message: "Event updated",
      event,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id },
    });
    res.json({
      message: "Event deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventByHost,
  updateEvent,
  deleteEvent
};
