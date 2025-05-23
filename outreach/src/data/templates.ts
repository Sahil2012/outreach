import { Template } from '../types';

export const templates: Template[] = [
  {
    id: '1',
    name: 'Job Application Referral',
    content: `Dear {{contactName}},

I hope this email finds you well. My name is [Your Name], and I recently came across a [Job Title] role (Job ID: {{jobIds}}) at {{companyName}}. I've attached my resume and would appreciate it if you could refer me for this position.

I've thoroughly researched {{companyName}} and am particularly impressed with [specific company achievement or value]. I believe my background in [relevant experience] makes me a strong fit for this role.

Here's the job posting for your reference: {{jobLinks}}

I understand referrals are valuable, and I appreciate your time and consideration. I'd be happy to discuss my qualifications further if needed.

Thank you,
[Your Name]
[Your Contact Information]`,
  },
  {
    id: '2',
    name: 'Follow-up After Application',
    content: `Dear {{contactName}},

I hope you're doing well. I'm reaching out to follow up on my application for the [Job Title] role (Job ID: {{jobIds}}) at {{companyName}}.

I submitted my application on [date] and wanted to reiterate my interest in joining your team. Having researched {{companyName}} extensively, I'm particularly drawn to [specific aspect of company] and believe my experience in [relevant skill/experience] would allow me to contribute effectively.

For your reference, here's the job posting: {{jobLinks}}

I've attached my resume for your convenience. If there's any additional information you need or if you'd like to discuss my application further, please don't hesitate to reach out.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Contact Information]`,
  },
  {
    id: '3',
    name: 'Networking and Informational Interview',
    content: `Dear {{contactName}},

I hope this message finds you well. My name is [Your Name], and I'm reaching out because I'm very interested in learning more about careers at {{companyName}}.

I've been following {{companyName}}'s work in [specific area/project] and am impressed by [specific achievement or aspect]. Currently, I'm exploring opportunities in [job field/title] (I noticed position IDs: {{jobIds}}) and would greatly value the chance to learn from your experience.

Would you be available for a brief 15-20 minute conversation to discuss your experience at {{companyName}} and any insights you might have for someone looking to join the team? I'm particularly interested in [specific question or area].

I've attached my resume for context, and here are the positions I'm interested in: {{jobLinks}}

Thank you for considering my request. I understand you're busy and appreciate any time you can spare.

Best regards,
[Your Name]
[Your Contact Information]`,
  },
];