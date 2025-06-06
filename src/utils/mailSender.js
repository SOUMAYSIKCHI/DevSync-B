const nodemailer = require("nodemailer");
require('dotenv').config();
const getVerificationEmailHTML = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DevSync - Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">

  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Email Content Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 5px 5px;">
              <h1 style="margin: 20px 0 10px; font-size: 40px; font-weight: 900; color: white; letter-spacing: -1px;">
                <span style="color: #4ade80;">Dev</span><span style="color: #ff4458;">Sync</span>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">

                    <!-- Greeting -->
                    <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1a1a2e;">
                      Welcome to DevSync! 👋
                    </h2>

                    <!-- Intro Message -->
                    <p style="margin: 0 0 30px; font-size: 16px; color: #64748b; line-height: 1.6;">
                      Thanks for signing up! To activate your account, please enter the following verification code in the signup process.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #ecfccb 0%, #bef264 100%); border: 2px dashed #65a30d; border-radius: 12px; padding: 25px;">
                          <div style="font-size: 14px; color: #4d7c0f; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            Email Verification Code
                          </div>
                          <div style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #4d7c0f; font-family: 'Courier New', monospace; margin: 10px 0;">
                            ${otp}
                          </div>
                          <div style="font-size: 12px; color: #84cc16; margin-top: 15px;">
                            This code will expire in 5 minutes
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Instructions -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-left: 4px solid #0284c7; padding: 15px; border-radius: 8px; text-align: left;">
                          <span style="display: inline-block; width: 20px; height: 20px; background: #0284c7; border-radius: 50%; margin-right: 10px; vertical-align: middle; text-align: center; color: white; font-weight: bold; font-size: 12px; line-height: 20px;">i</span>
                          <span style="font-size: 14px; color: #1e3a8a; vertical-align: middle;">
                            <strong>Next Steps:</strong> Enter this code during signup to verify your email and complete your registration.
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Note -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #fef7cd 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: left;">
                          <span style="display: inline-block; width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; margin-right: 10px; vertical-align: middle; text-align: center; color: white; font-weight: bold; font-size: 12px; line-height: 20px;">!</span>
                          <span style="font-size: 14px; color: #92400e; vertical-align: middle;">
                            <strong>Security Tip:</strong> If you didn’t sign up for DevSync, you can safely ignore this message.
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer Message -->
                    <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                      Need help? Reach out to our support team any time. We’re here to help you code with confidence.
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px 40px; text-align: center;">
              <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.7); font-size: 14px;">
                DevSync - Seamless Developer Onboarding
              </p>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 12px; font-style: italic;">
                Connect • Collaborate • Code
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


const getResetEmailHTML = (otp) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevSync - Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 20px 0;">
        <tr>
            <td align="center">
                
                <!-- Email Content Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="padding: 40px 5px 5px;">
                            
                            <!-- Logo Icon -->
  
                            
                            <!-- Logo Text -->
                            <h1 style="margin: 20px 0 10px; font-size: 40px; font-weight: 900; color: white; letter-spacing: -1px;">
                                <span style="color: #4ade80;">Dev</span><span style="color: #ff4458;">Sync</span>
                            </h1>
                            
                        </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 0 20px;">
                            
                            <!-- White Content Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="padding: 40px 30px; text-align: center;">
                                        
                                        <!-- Greeting -->
                                        <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1a1a2e;">
                                            Welcome Back! 🔐
                                        </h2>
                                        
                                        <!-- Message -->
                                        <p style="margin: 0 0 30px; font-size: 16px; color: #64748b; line-height: 1.6;">
                                            We received a request to reset your DevSync account password. Use the verification code below to create a new password and regain access to your developer account.
                                        </p>
                                        
                                        <!-- OTP Container -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center" style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border: 2px dashed #f87171; border-radius: 12px; padding: 25px;">
                                                    
                                                    <!-- OTP Label -->
                                                    <div style="font-size: 14px; color: #dc2626; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                                        Password Reset Code
                                                    </div>
                                                    
                                                    <!-- OTP Code -->
                                                    <div style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #dc2626; font-family: 'Courier New', monospace; margin: 10px 0;">
                                                        ${otp}
                                                    </div>
                                                    
                                                    <!-- OTP Note -->
                                                    <div style="font-size: 12px; color: #ef4444; margin-top: 15px;">
                                                        This code expires in 5 minutes
                                                    </div>
                                                    
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Security Note -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #fef7cd 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: left;">
                                                    <span style="display: inline-block; width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; margin-right: 10px; vertical-align: middle; text-align: center; color: white; font-weight: bold; font-size: 12px; line-height: 20px;">!</span>
                                                    <span style="font-size: 14px; color: #92400e; vertical-align: middle;">
                                                        <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email and contact our support team immediately.
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Instructions -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; text-align: left;">
                                                    <span style="display: inline-block; width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; margin-right: 10px; vertical-align: middle; text-align: center; color: white; font-weight: bold; font-size: 12px; line-height: 20px;">i</span>
                                                    <span style="font-size: 14px; color: #1e40af; vertical-align: middle;">
                                                        <strong>Next Steps:</strong> Enter this code on the password reset page, then create your new secure password to continue coding with DevSync.
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Bottom Message -->
                                        <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                                            For your security, this reset code will expire automatically after 5 minutes. If you need a new code, you can request another password reset from the login page.
                                        </p>
                                        
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="padding: 30px 20px 40px; text-align: center;">
                            
                            <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.7); font-size: 14px;">
                                Secure access to your DevSync account
                            </p>
                            
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 12px; font-style: italic;">
                                Connect • Collaborate • Code
                            </p>
                            
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
`
 
const mailSender = async(emailId,title,otp,flag) => {
    try{
        let transponder = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        var emailHtml = getVerificationEmailHTML(otp);
        if(!flag){
            emailHtml = getResetEmailHTML(otp);
        }
        let info = await transponder.sendMail({
            from: 'DevSync || Soumay Sikchi',
            to:`${emailId}`,
            subject:`${title}`,
            html:`${emailHtml}`,
        })
        return info;
    }catch(error){
        return error;
    }
}

module.exports = mailSender;