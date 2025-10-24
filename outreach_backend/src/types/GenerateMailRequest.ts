
interface GenerateMailRequest {
  resumeLink: string;
  jobId: string;
  hrName: string;
  companyName: string;
  roleType? : string;
  roleDescription? : string;
}

export default GenerateMailRequest;