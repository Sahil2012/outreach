import extractSkills from "../service/extractSkills.js";
import generateEmail from "../service/generateEmail.js";

const generateMail = async (req, res, next) => {
  try {
    const { resumeLink, jobId, hrName, companyName } = req.body;

    if (!resumeLink || !jobId || !hrName || !companyName) {
        const error = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }

    const userSpecificDetails = await extractSkills(resumeLink);
    userSpecificDetails.jobId = jobId;
    userSpecificDetails.hrName = hrName;
    userSpecificDetails.companyName = companyName;

    const email = await generateEmail(userSpecificDetails);
    return res.status(200).json({ email });
  } catch (error) {
    console.error("Error generating email:", error);
    next(error);
  }
};

export default generateMail;
