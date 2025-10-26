// emailTemplates.ts
interface EmailTemplate {
  html: string;
  without_html: string;
}
export const issueUpdated = (
  userName: string,
  issueTitle: string,
  updateStatus: string
): EmailTemplate => {
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <h2 style="color: #333;">Hi ${userName},</h2>
                  <p style="color: #555;">
                      Your reported issue "<strong>${issueTitle}</strong>" has been updated.
                  </p>
                  <p style="color: #555;">
                      Current Status: <strong>${updateStatus}</strong>
                  </p>
                  <p style="color: #555; margin-top: 20px;">
                      Thank you for helping us improve the community.
                  </p>
              </div>`;

  const without_html = `
Hi ${userName},

Your reported issue "${issueTitle}" has been updated.
Current Status: ${updateStatus}


Thank you for helping us improve the community.
`;

  return { html, without_html };
};

export const issueUpvoted = (
  userName: string,
  issueTitle: string,
  upvoteCount: number
): EmailTemplate => {
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <h2 style="color: #333;">Hi ${userName},</h2>
                  <p style="color: #555;">
                      Your reported issue "<strong>${issueTitle}</strong>" has received a new upvote!
                  </p>
                  <p style="color: #555;">
                      Total Upvotes: <strong>${upvoteCount}</strong>
                  </p>
                  <p style="color: #555; margin-top: 20px;">
                      Keep contributing and make a difference in your community!
                  </p>
              </div>`;

  const without_html = `
Hi ${userName},

Your reported issue "${issueTitle}" has received a new upvote!
Total Upvotes: ${upvoteCount}

Keep contributing and make a difference in your community!
`;

  return { html, without_html };
};

export const userRegistration = (
  name: string,
  email: string,
  password: string
): EmailTemplate => {
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                  <h2 style="color: #333;">Hi ${name},</h2>
                  <p style="color: #555;">
                      Welcome! Your Account has been created successfully. Here are your login details:
                  </p>
                  <p style="color: #555;">
                      <strong>Email:</strong> ${email}<br>
                      <strong>Password:</strong> ${password}
                  </p>
              </div>`;

  const without_html = `
              Hi ${name},
              Welcome! Your Account has been created successfully. Here are your login details:
              Email: ${email}
              Password: ${password}
          `;

  return { html, without_html };
};
