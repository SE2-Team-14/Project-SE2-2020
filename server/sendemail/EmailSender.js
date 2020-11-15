const nodemailer = require('nodemailer');


/**Helper module for sending email from a specific emailng account*/
class EmailSender {

    /**Create a new email sander for the email account
     * @param host string containing the email service (for example 'stmp.gmail.com')
     * @param email string containing sender email address
     * @param password the password for the specified sender email address
    */
    constructor(host, email, password) {
        this.email = email;
        this.password = password;
        this.host = host;

        this.transporter = nodemailer.createTransport({
            host: this.host,
            auth: { user: this.email, pass: this.password }
        });
    }


    /**Send an email to a specific email address.
     * @param recipients string array containing the email addressed for the people who has to recevie the email
     * @param subject string containing the subject of the email
     * @param message string containing the body of the email
     * @return a promise that trow an error object in case of failure, a response object in case of success
    */
    sendEmail(recipients, subject, message) {
        if (!recipients || recipients.length === 0) {
            throw { message: 'recipients for the email are missing' };
        }

        let receivers = ""

        for (let recipient of recipients) {
            receivers += recipient + ","
        }
        receivers = receivers.slice(0, -1)// erase last comma

        let email = {
            from: this.email,
            to: receivers,
            subject: subject,
            text: message
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(email, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            })
        });
    }
}


module.exports = EmailSender;