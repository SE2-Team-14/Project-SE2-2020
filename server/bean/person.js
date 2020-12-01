/**
 * Person object that contains information about a person involved with the booking system: student, teacher, booking manager, support officer
 * @param id a string containing the identifier of the person
 * @param name a string containing the name of the person
 * @param surname a string containing the surname of the person
 * @param role a string containing the role a person takes inside the booking system. Possible values are Student, Teacher, Manager(not yet implemented) and Officer(not yet implemented)
 * @param email a string containing the email used by the person to access the booking system in the login phase
 * @param password a string containing the password used by the person to access the booking system in the login phase
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
}

module.exports = Person;