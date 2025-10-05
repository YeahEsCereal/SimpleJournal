let journalEntries = []
let viewStates = {
    Gratitude: true,
    Goal: true,
    Starred: false,
    All: true
}
let newEntryType = 'Gratitude'
document.querySelector('.typeSelected').textContent = `Selected: ${newEntryType}`
refreshEntries()

function selectType(entryType) {
    newEntryType = entryType
    document.querySelector('.typeSelected').textContent = `Selected: ${newEntryType}`
}

function addEntry() {
    let newEntryContent = document.querySelector('.newEntryInput').value
    if (newEntryContent.trim() == '') {return}
    journalEntries.push([newEntryContent, newEntryType, false])
    refreshEntries()
    document.querySelector('.newEntryInput').value = ''
}

function removeEntry(index) {
    journalEntries.splice(index, 1)
    refreshEntries()
}

function selectView(viewType) {
    if (viewType != 'All') {
        viewStates[viewType] = !viewStates[viewType]
        document.querySelector(`.viewButton.${viewType}`).classList.toggle('selected')
        let allDebug = []

        Object.keys(viewStates).forEach((key) => {
            if (key != 'Starred' && key != 'All') {
                allDebug.push(viewStates[key])
            } else if (key != 'All') {
                allDebug.push(!viewStates[key])
            }
        })

        if (!allDebug.includes(false)) {
            document.querySelector('.viewButton.All').classList.add('selected')
            viewStates.All = true
        } else {
            document.querySelector('.viewButton.All').classList.remove('selected')
            viewStates.All = false
        }
    } else {
        if (viewStates.All == false) {
            viewStates.All = true

            Object.keys(viewStates).forEach((key) => {
                if (key != 'Starred') {
                    viewStates[key] = true
                    document.querySelector(`.viewButton.${key}`).classList.add('selected')
                } else {
                    viewStates[key] = false
                    document.querySelector(`.viewButton.${key}`).classList.remove('selected')
                }
            })
        } else {
            viewStates.All = false

            Object.keys(viewStates).forEach((key) => {
                viewStates[key] = false
                document.querySelector(`.viewButton.${key}`).classList.remove('selected')
            })
        }
    }

    refreshEntries()
}

function starEntry(index) {
    document.querySelector(`[data-entry-index='${index}']`).classList.toggle('starred')
    journalEntries[index][2] = !journalEntries[index][2]
}

function moveEntry(index, direction) {
    if (direction == 'up' && index > 0) {
        [journalEntries[index], journalEntries[index - 1]] = [journalEntries[index - 1], journalEntries[index]]
    } else if (direction == 'down' && index < journalEntries.length - 1) {
        [journalEntries[index], journalEntries[index + 1]] = [journalEntries[index + 1], journalEntries[index]]
    }

    refreshEntries()
}

function refreshEntries() {
    const journalEntriesDiv = document.querySelector('.journalEntries')

    while (journalEntriesDiv.firstChild) {
        journalEntriesDiv.removeChild(journalEntriesDiv.firstChild);
    }

    journalEntries.forEach((x, index) => {
        const [content, entryType, isStarred] = x

        const viewSelected = viewStates[entryType] && (isStarred || !viewStates.Starred)

        if (!viewSelected) {
            return
        }

        const currEntryDiv = document.createElement('div')
        currEntryDiv.classList.add('journalEntry')
        currEntryDiv.setAttribute('data-entry-index', index)
        if (isStarred) {
            currEntryDiv.classList.add('starred')
        }

        const currEntryHeader = document.createElement('h3')
        currEntryHeader.textContent = entryType
        if (entryType == 'Gratitude') {
            currEntryHeader.style.backgroundColor = 'hsl(99, 87%, 58%)'
        } else if (entryType == 'Goal') {
            currEntryHeader.style.backgroundColor = 'hsl(194, 87%, 58%)'
        }

        const currEntryParagraph = document.createElement('p')
        currEntryParagraph.textContent = content

        const currEntryRemove = document.createElement('button')
        currEntryRemove.textContent = 'X'
        currEntryRemove.classList.add('removeEntry')
        currEntryRemove.onclick = () => {removeEntry(index)}

        const currEntryStar = document.createElement('button')
        currEntryStar.textContent = '✦'
        currEntryStar.classList.add('starEntry')
        currEntryStar.onclick = () => {starEntry(index)}

        const currEntryDown = document.createElement('button')
        currEntryDown.textContent = '↓'
        currEntryDown.classList.add('moveEntryDown')
        currEntryDown.onclick = () => {moveEntry(index, 'down')}

        const currEntryUp = document.createElement('button')
        currEntryUp.textContent = '↑'
        currEntryUp.classList.add('moveEntryUp')
        currEntryUp.onclick = () => {moveEntry(index, 'up')}

        currEntryDiv.appendChild(currEntryHeader)
        currEntryDiv.appendChild(currEntryParagraph)
        currEntryDiv.appendChild(currEntryRemove)
        currEntryDiv.appendChild(currEntryStar)
        currEntryDiv.appendChild(currEntryDown)
        currEntryDiv.appendChild(currEntryUp)

        journalEntriesDiv.appendChild(currEntryDiv)
    })

}
