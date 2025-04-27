export const htmlTemplate = (username) => {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
      body {
        background-color: #f9f9f9;
        margin: 0;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        text-align: center;
      }
      h1 {
        color: #333333;
        font-size: 24px;
        margin-bottom: 20px;
      }
      p {
        color: #555555;
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #aaaaaa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to NewsAPIx</h1>
      <p>Hi ${username},<br><br>
      Thanks for joining <strong>NewsAPIx</strong>!<br>
      Stay tuned for the latest news, updates, and stories delivered directly to you.</p>
      <div class="footer">
        &copy; 2025 NewsAPIx. All rights reserved.
      </div>
    </div>
  </body>
  </html>
    `;
  };
  