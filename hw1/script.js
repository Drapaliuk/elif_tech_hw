'use strict'

const tableListeners = [{event: 'click', handler: function(e) {
                            console.log(`Click by table with id ${this.dataset.tableid}`)
                        }}]
const cellListeners = [
                        {event: 'click', handler: function(e){
                            console.log(`Click by cell with id ${this.dataset.elemid}`)
                        }},
                        // {event: 'mousemove', handler: function(e){
                        //     console.log(`Mouse move over cell with id ${this.dataset.elemid}`)
                        // }}
                       ]
const tableClasses = ['table', 'test-class-for-table']
const cellClasses = ['cell', 'cell-active', 'some-another-class']


const options = { //options for Table class
    tableClasses,
    cellClasses,
    tableListeners,
    cellListeners,
}

class Table {
    constructor(height, width, rows, columns, options) {
        this._id = generateTableID()
        this.height = validate(height, 'height')
        this.width = validate(width, 'width')
        this.rows = validate(rows, 'rows')
        this.columns = validate(columns, 'columns')
        this.options = options

        function validate(value, argumentName) {
            const transformedToNumber = +value
            const isValueNumber = typeof transformedToNumber
            const isNaNValue = isNaN(transformedToNumber)
            
            if(isValueNumber && !isNaNValue) {
                return value
            }
            throw new Error(`Error in "${argumentName}" argument, you must pass number type or string number`)
        }

        function generateTableID() {
            if(!window.tableIDs) window.tableIDs = []
            const id = window.tableIDs.length + 1
            window.tableIDs.push(id)
    
            return id
        }
    }

    static getTableById(id) { //getting table DOM element by id
        return document.querySelector(`[data-tableid = "${id}"]`)
    }

    static getCellByIds(tableId, cellId) { //getting cell of table by id
        const table = Table.getTableById(tableId)
        
        if(!cellId) return table.children

        return table.querySelector(`[data-elemid = "${cellId}"]`)
    }

    static getRegisteredTables() {
        return window.tableIDs
    }

    static unregisterTable(tableId) {
        const updatedIds = window.tableIDs.filter(id => id !== tableId)
        window.tableIDs = updatedIds
    }

    getTable() { //just get DOM element for personal using
        const table = this._createTable()
        const cells = this._createCells()
        table.append(...cells)
        return {id: this._id, table}
    }

    mount(container) { //method for table mounting
        if(!container) {
            throw new Error('You must pass HTML element, id, or name of class for searching')
        }

        const identificationMarks = ['.', '#']
        const isString = typeof container === 'string'
        const isHTMLElement = container instanceof HTMLElement

        if(isString && !identificationMarks.includes(container[0])) {
            throw new Error('You should pass string with mark your identification, "." for class, and "#" for id')
        }

        const {id, table} = this.getTable()

        if(isHTMLElement) container.append(table)
        if(isString) {
            const foundElement = document.querySelector(container)
            if(!foundElement) {
                throw new Error('The element by your identification has not found')
            }
            foundElement.append(table)
        }

        return {id}
    }
    
    get id() {
        return this._id
    }

    set setId(newId) {
        const DOMElement = Table.getTableById(this._id)
        const tableIDs = window.tableIDs
        const isExistId = tableIDs.includes(newId)
        const isTheSameId = newId === this._id 
        
        if(isTheSameId) return {id: newId}
        if(isExistId) throw new Error(`ID ${newID} is used!`)

        const idx = tableIDs.findIndex(id => id === this._id)

        if(DOMElement) {
            DOMElement.setAttribute('data-tableId', newId)
        }

        tableIDs[idx] = newId
        this._id = newId

        return {id: newId}
        
    }

    _addStylesForTable(table) {
        table.style.display = 'grid'
        table.style.width = `${this.width}px`
        table.style.backgroundColor = 'brown'
        table.style.height = `${this.height}px`
        table.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`
        table.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`
    }

    _addEventHandlers(elem, data) {
        data.forEach(({event, handler}) => {
            elem.addEventListener(event, handler)
        })
    }

    _createTable() {
        const tableClasses = this?.options?.tableClasses
        const tableListeners = this?.options?.tableListeners
        const table = document.createElement('div')
        this._addStylesForTable(table)
        table.setAttribute('data-tableId', this._id)

        if(tableListeners && Array.isArray(tableClasses) && tableListeners.length > 0) {
            this._addEventHandlers(table, tableListeners)
        }

        if(tableClasses && Array.isArray(tableClasses) && tableClasses) {
            table.classList.add(...tableClasses)
        }

        return table
    }

    _createCells() {
        const cellsAmount = this.rows * this.columns
        const cellClasses = this?.options?.cellClasses
        const cellListeners = this?.options?.cellListeners
        const isCellClasses = cellClasses && Array.isArray(cellClasses)
        const isCellListener = cellClasses && Array.isArray(cellListeners)
        const cells = []

        for(let i = 0; i < cellsAmount; i++) {
            const cell = document.createElement('div')
            if(isCellClasses) cell.classList.add(...cellClasses)
            if(isCellListener) this._addEventHandlers(cell, cellListeners) //! only for demonstration
            
            cell.setAttribute('data-elemId', i)
            cell.textContent = i //for simple of checking homework
            cells.push(cell)
        }
        return cells
    }
}


const root = document.querySelector('.root')



const testTableOne = new Table(350, 450, 5, 6, options)
const testTableTwo = new Table(200, 200, 4, 8, options).mount('.root')      // you can pass name of class or id with dot / hash before ones

const {id: tableID} = testTableOne.mount(root)                                    // you can pass HTML element
const {id, table} = testTableOne.getTable()                                 // this method return id and table like DOM element and table id
root.append(table)

testTableOne.setId = 'customized id'                                    // you can customize id by setter, id will change in the DOM element TOO!

const someTable = Table.getTableById(2)                                 // by using this static method you can get any created tables from DOM
const someCell = Table.getCellByIds('customized id', 11)                // this method return needed cell from certain table or all cells if you don`t pass second argument
const registeredTables = Table.getRegisteredTables()                    // you will get all registered tables
Table.unregisterTable('customized id')                                  // after delete table from DOM recommend unregister table for right methods working



console.log('someTable', someTable)
console.log('someCell', someCell)
console.log('registeredTables', registeredTables)
