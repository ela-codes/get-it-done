export class List {
    constructor(name) {
        this.name = name;
        this.tasks = [];
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

    latestTask() {
        return this.tasks[this.totalLength() -1]
    }

    totalLength() {
        return this.tasks.length
    }

    deleteTask(index) {
        this.tasks.splice(index, 1)
        console.group(`Successfully deleted from class array. New task list: `)
        console.dir(this.allTasks)
    }

}


