export class Task {
    constructor(title, dueDate, status, id, displayed) {
        this.title = title;
        this.dueDate = dueDate;
        this.status = status; // false = task is not done
        this.id = id;
        this.displayed = displayed;
    }

    getID() {
        return this.id
    }
    
    // GETTERS
    get currTitle() {
        return this.title
    }

    get currDueDate() {
        return this.dueDate
    }

    get currStatus() {
        return this.status
    }

    get displayedStatus() {
        return this.displayed;
    }
    
    get currID() {
        return this.id;
    }

    //SETTERS
    set currTitle(newTitle) {
        this.title = newTitle
    }

    set currDueDate(newDate) {
        this.dueDate = newDate
    }
    
    /**
     * @param {boolean} newStatus
     */

    set currStatus(newStatus) {
        this.status = newStatus
    }

    set displayedStatus(newDisplayStatus) {
        this.displayed = newDisplayStatus
    }

    set currID(newID) {
        this.id = newID
    }
    
}

