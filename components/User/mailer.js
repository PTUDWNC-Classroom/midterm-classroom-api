const nodemailer = require("nodemailer");



const saltRounds = 10;
let count;
let email;
let globalOTP = "";

async function configEmailToSend (account, OTP) {
    const smtpTransport = nodemailer.createTransport('smtps://ptudwnc.classroom%40gmail.com:hcmusk18%40ddl@smtp.gmail.com');
    const mail = {
        from: "From@gmail.com",
        to: account,
        subject: "MÃ XÁC NHẬN",
        html: "<b>Mã xác nhận của bạn là: </b>" + OTP
    }
    return {smtpTransport,mail};
}

exports.sendmail = async (email,content) => {
    
    console.log("sendmail");
    console.log(email);
    const mailer = await configEmailToSend(email,content);
    const smtpTransport = (await mailer).smtpTransport;
    const mail = (await mailer).mail;

    smtpTransport.sendMail(mail);
};