Landing

1. Hero 1.5. Demo
2. Features - left accordion, right detials (sexy bento style animations)
3. 3 column layout - benefits
4. Pricing
5. CTA
6. Footer

Application Flows:

- Sign up -> complete profile (name, email, phone, resume upload (optional)) ->
  add/edit skills, experience, education -> dashboard
- sign in -> dashboard

Features:

- onboarding:

  - /profile/readiness (for status) status: pending | completed
  - /profile (for resume) data

- create mail: create mail button -> mail create stepper 
    - select template 
        - /outreach/types (GET) 
    - Fill in details (employee Name, Email, Company Name,Job ID (optional), Job Description) 
        - /outreach/generate/:id (POST) 
        { name, email, company name, jobid, jobdescription, template_type } 
    - Preview 
        - /outreach/edit/:id (POST) 
    - Send (send via gmail (easy for user) or copy to clipboard (should be hard for user so that he uses gmail)) 
        - /outreach/send/:id (POST)

- pricing

  -

- dashboard

  - 4 stats - (reached out, referred, follow ups, Absconded) - /outreach/stats
  - search & filters - search (company name, employee name), filter (status)
  - Table - /outreach/meta?page&limit
    - need attention badge (dot)
    - name (email below name)
    - conmpany name
    - status (generated, sent, first follow up, second follow up, third follow
      up, absconded, responded, referred) - /outreach/:id (patch)
    - automated or not (if the email trail is manual or automated) (should be
      togglable) - /outreach/:id (patch)
    - last activity
    - actions:
      - follow up - /outreach/send/:id
      - mark as absconded - /outreach/:id (patch)
      - mark as referred - /outreach/:id (patch)

- /outreach/:id - endpoint (/outreach/:id)

  - show email thread and related data
  - actions: (ui design - on top right corner)
    - mark as absconded
    - mark as referred
    - follow up

- profile page
  - edit profile
  - credits
    - buy
    - history
