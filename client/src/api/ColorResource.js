/**
 * ColorResource object used in the component LessonsCalendar to generate color resources used to have a different color for each course
 * 
 * @param id an integer corresponding to the identifier of the ColorResource
 * @param fieldName a string containing the name associated with the ColorResource
 * @param instances an array of Instance objects used to generate the color of each title present
 */
class ColorResource {
    constructor(id, fieldName, instances) {
        this.id = id;
        this.fieldName = fieldName;
        this.instances = instances;
    }
}

export default ColorResource;