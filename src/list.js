export class List {
    constructor(name) {
        this.name = name;
        this.properName = ""
        this.tasks = [];
    }

    static createNew(listName) {
        const newList = new List(listName)
        return newList
    }

    static createDefault() {
        const defaultList = new List('Today');
        defaultList.properListName = 'Today'
        console.log(defaultList)
        return defaultList
    }

    get listName() {
        return this.name
    }

    get allTasks() {
        return this.tasks
    }

    get properListName() {
        return this.properName
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

    set properListName(newName) {
        this.properName = newName
    }


    latestTask() {
        return this.tasks[this.totalLength() -1]
    }

    totalLength() {
        return this.tasks.length
    }

    deleteTask(index) {
        this.tasks[index] = null
    }

    updateListAfterTaskRemoval() {
        const newList = this.tasks.filter(task => task !== null)
        this.tasks = newList
    }
}

export function getNewList(name) {
    const newList = List.createNew(name)

    function removeWhitespace(name) {
        let properName = ""
        for (let char of name) {
            properName += (char !== " ") ? char : '-'
        } 
        return properName
    }
    newList.properListName = removeWhitespace(name)
    return newList
}
