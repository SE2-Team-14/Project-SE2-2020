class Officer {
    constructor (officerId, name, surname, isManager, email, password) {
        this.officerId = officerId;
        this.name = name;
        this.surname = surname;
        this.isManager = isManager;
        this.email = email;
        this.password = password;
    }
}

module.exports = Officer;