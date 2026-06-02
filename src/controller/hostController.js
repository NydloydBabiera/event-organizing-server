const prisma = require("../prisma");

const addHost = async (req, res) => {
  try {
    const { name, address, contact_details } = req.body;

    const existingHost = await prisma.host.findUnique({
      where: {
        name,
      },
    });

    if (existingHost) {
      return res.status(400).json({
        message: "Host with this name already exists",
      });
    }

    const host = await prisma.host.create({
      data: {
        name,
        address,
        contact_details,
      },
    });

    res.status(201).json({
      message: "Host created",
      host,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating host",
      error: error.message,
    });
  }
};

const getHosts = async (req, res) => {
  try {
    const hosts = await prisma.host.findMany();
    res.status(200).json({
      message: "Hosts retrieved",
      hosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving hosts",
      error: error.message,
    });
  }
};

module.exports = {
  addHost,
  getHosts,
};
