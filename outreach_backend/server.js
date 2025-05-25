import extractSkils from "./service/extractSkills.js";
import generateEmail from "./service/generateEmail.js";

const userSpecificDetails = await extractSkils("https://drive.google.com/file/d/1ySD__169oWjRQSN589h2e1-lq75K6uET/view");

userSpecificDetails.jobId = [123,234,567];
userSpecificDetails.hrName = 'Himanshu';
userSpecificDetails.companyName = '';

const email = await generateEmail(userSpecificDetails);

console.log(email);
