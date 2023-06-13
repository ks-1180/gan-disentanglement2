export default async (req, res) => {
  const { space, direction } = req.query;

  try {
    const totalWalks = await prisma.walk.count({
      where: {
        space: space,
        direction: direction,
      },
    });

    res.status(200).json({ total: totalWalks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
