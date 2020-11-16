const nodemailer = require('nodemailer');

/**Helper module for sending email from a specific emailng account*/
class EmailSender {

    /**Create a new email sander for the email account
     * @param service string containing the email service (for example 'gmail')
     * @param email string containing sender email address
     * @param password the password for the specified sender email address
    */
    constructor(service, email, password) {
        this.service = service;
        this.email = email;
        this.password = password;

        this.transporter = nodemailer.createTransport({
            service: this.service,
            port: 465,
            secure: true,
            auth: { user: this.email, pass: this.password }
        });

    }

    /**Send an email to a specific email address.
     * @param recipients string array containing the email addressed for the people who has to recevie the email, or just a string with one single email sended
     * @param subject string containing the subject of the email
     * @param message string containing the body of the email
     * @return a promise that trow an error object in case of failure, a response object in case of success
    */
    async sendEmail(recipients, subject, message) {
        let receivers;
        let missingRecipents = false;
        let email;
        if (!recipients || recipients.length === 0) {
            missingRecipents = true;
        } else {
            receivers = this.__recipientsToString(recipients);
            email = {
                from: this.email,
                to: receivers,
                subject: subject,
                text: message
            };
        }

        return new Promise((resolve, reject) => {
            if (missingRecipents) {
                reject(new Error('recipients for the email are missing'));
                return;
            }
            this.transporter.sendMail(email, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve(info.response);
                }
            })
        });
    }


    /**method that returns a promise to check if the connection is valid, useful while testing*/
    verifyConnection() {
        return new Promise((resolve, reject) => {
            // verify connection configuration
            this.transporter.verify(function (error, success) {
                if (error) {
                    reject(error);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**Private method to format received recipients as a string (eventually comma separed)  */
    __recipientsToString(recipients) {
        let receivers = "";
        if (Array.isArray(recipients)) {
            for (let recipient of recipients) {
                receivers += recipient + ","
            }
            receivers = receivers.slice(0, -1) // erase last comma
        } else {
            receivers = recipients // passed just a single email
        }
        return receivers;
    }
}


module.exports = EmailSender;