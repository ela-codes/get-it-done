export class List {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    static createNew(listName) {
        const newList = new List(listName)
        return newList
    }

    static createDefault() {
        const defaultList = new List('Default');
        return defaultList
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
        console.log(`Successfully deleted from class array. New task list: `)
        console.dir(this.allTasks)
    }
}


