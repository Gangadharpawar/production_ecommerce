
import nodemailer from 'nodemailer';
export const enquireMail = async (req, res) => {
    console.log(req.body);
    const { name, email, message } = req.body;
    console.log(name, email, message);
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,  // Disable TLS checking
            }
        });
        await transporter.verify();
        const mailOptions = {
            from: `"${name} via MyApp" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Enquiry from ${name}`,
            text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).send({
            success: true,
            message: "Email sent successfully!",
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Failed to send email."
        });
    }
}