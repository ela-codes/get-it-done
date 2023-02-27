export class Task {
    constructor(title, dueDate, id) {
        this.title = title;
        this.dueDate = dueDate;
        this.status = false; // false = task is not done
        this.id = id
    }


    // GETTERS
    get taskTitle() {
        return this.title
    }

    get currDueDate() {
        return this.dueDate
    }

    get currStatus() {
        return this.status
    }

    //SETTERS
    set taskTitle(newTitle) {
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
}


