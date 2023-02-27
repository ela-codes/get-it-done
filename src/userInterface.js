import { format } from 'date-fns'

export function getTodaysDate() {
    const dateInput = document.querySelector('input[name="new-date"]')
    dateInput.value = format(Date.now(), 'yyyy-MM-dd')
}

export function showNewTask(currTask) {
    
    const createNewTaskLine = () => {
        const div = document.createElement('div')
        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('value', currTask.taskTitle)
        input.setAttribute('id', currTask.id)

        const label = document.createElement('label');
        label.setAttribute('for', currTask.id)
        label.innerHTML = currTask.taskTitle

        div.append(input, label)
        return div
    }

    const listOnScreen = document.querySelector('.checklist.active')
    listOnScreen.append(createNewTaskLine())

}