/**
 * Person object containing information about a person involved with the booking system: student, teacher, booking manager, support officer
 * 
 * @param id a string containing the identifier of the person
 * @param name a string containing the name of the person
 * @param surname a string containing the surname of the person
 * @param role a string containing the role of the person in the booking system. Possible values are Student, Teacher, Manager(not yet implemented), Officer(not yet implemented)
 * @param email a string containing the email used by the person to access the system in the login phase
 * @param password a string containing the password used by the person to access the system in the login phase
 */
class Person {
    constructor(id, name, surname, role, email, password) {
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