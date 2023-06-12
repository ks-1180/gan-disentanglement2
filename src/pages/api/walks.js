import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { space, direction } = req.query;

  try {
    const walks = await prisma.walk.findMany({
      where: {
        space: space,
        direction: direction,
      },
      include: {
        attributes: {
          include: {
            steps: {
              orderBy: {
                intensity: 'asc',
              },
            },
          },
        },
      },
    });

    res.status(200).json(walks);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
};
