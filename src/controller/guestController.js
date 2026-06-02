const prisma = require("../prisma");

const addGuest = async (req, res) => {
  try {
    const { name, type, event_id } = req.body;
    console.log("🚀 ~ addGuest ~ req.body:", req.body);

    const guest = await prisma.guest.create({
      data: {
        name,
        type,
        event_id,
      },
    });

    res.status(201).json({
      message: "Guest created",
      guest,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getGuestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const guests = await prisma.guest.findMany({
      where: {
        event_id: parseInt(eventId),
      },
    });

    res.status(200).json({
      message: "Guests fetched successfully",
      guests,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const guest = await prisma.guest.update({
      where: { id },
      data: { name, type },
    });
    res.json({
      message: "Guest updated",
      guest,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.guest.delete({
      where: { id },
    });
    res.json({
      message: "Guest deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  addGuest,
  getGuestsByEvent,
  updateGuest,
  deleteGuest
};
