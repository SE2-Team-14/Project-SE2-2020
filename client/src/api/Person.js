class Person {
    constructor (id, name, surname, role, email, password) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.role = role;
        this.email = email;
        this.password = password;
    }

    static from(json) {
        const e = Object.assign(new Person(), json);
        return e;
    }

}

export default Person;