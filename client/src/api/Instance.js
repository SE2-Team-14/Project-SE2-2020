/**
 * Instance object used in an array contained by the class ColorResource to have an association title-color
 * 
 * @param id a string containing the name of the title 
 * @param color an hexadecimal value corresponding to the calculated hash value of the color associated to the title
 */
class Instance {
    constructor(id, text, color) {
        this.id = id;
        this.text = text;
        this.color = color;
    }
}

export default Instance;