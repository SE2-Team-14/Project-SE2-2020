class OfficerAccount {
    constructor(name, surname, isManager, email, password) {
        this.name = name;
        this.surname = surname;
        this.isManager = isManager;
        this.email = email;
        this.password = password;
    }

    static from(json) {
        const e = Object.assign(new OfficerAccount(), json);
        return e;
    }
}

export default OfficerAccount;