export class List {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    totalLength() {
        return this.tasks.length
    }

    get listName() {
        return this.name
    }
    get allTasks() {
        return this.tasks
    }

    /**
    * @param {Object} task

    */

    set addTask(task) {
        this.tasks.push(task)
    }

    /** 
    * @param {String} newName
    */

    set listName(newName) {
        this.name = newName
    }

}


