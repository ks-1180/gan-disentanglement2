import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  const { space, direction, walk } = req.query;
  const chunk = Math.floor(walk/10);

  try {
    // Construct the path to the required JSON file
    const filePath = path.join(process.cwd(), `chunks/${space}/${direction}/${chunk}.json`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Read the file and parse it as JSON
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let walks = JSON.parse(fileContents);
    let walkData = walks[walk%10];

    // Paginate the results
    // walks = walks.slice(skip, skip + parseInt(limit));

    res.status(200).json(walkData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

