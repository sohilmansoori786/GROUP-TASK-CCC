const { z } = require("zod");

const opportunitySchema = z.object({
  title: z.string().min(2).max(200),

  description: z.string().min(10).max(5000),

  organization: z.string().min(2).max(200),

  category: z.string().min(2).max(100),

  skillsRequired: z.array(z.string()).optional(),

  location: z.string().optional(),

  deadline: z.string(),

  applicationLink: z.string().url()
});

module.exports = {
  opportunitySchema
};