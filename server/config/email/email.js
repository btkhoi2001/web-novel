import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            secure: true,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text,
        });

        console.log("email sent successfully");
        return true;
    } catch (error) {
        console.log(error, "email not sent");
        return false;
    }
};
