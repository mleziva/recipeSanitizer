"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation of a classic stack.
 */
class Main {
    /**
     * Creates a pre-populated stack.
     *
     * @param {T[]} initialData the initial contents of the stack
     */
    constructor(initialData = []) {
        // Internal storage for the stack
        this._items = [];
        this._items.push(...initialData);
    }
    /**
     * Adds an item to the top of the stack.
     *
     * @param {T} item the item to be added to the stack
     */
    push(item) {
        this._items.push(item);
    }
    /**
     * Removes an item from the top of the stack, returning it.
     *
     * @returns {T} the item at the top of the stack.
     */
    pop() {
        return this._items.pop();
    }
    /**
     * Take a peek at the top of the stack, returning the top-most item,
     * without removing it.
     *
     * @returns {T} the item at the top of the stack.
     */
    peek() {
        if (this.isEmpty())
            return undefined;
        else
            return this._items[this._items.length - 1];
    }
    /**
     * @returns {boolean} true if the stack is empty.
     */
    isEmpty() {
        return this._items.length === 0;
    }
    /**
     * @returns {number} the number of items in the stack.
     */
    size() {
        return this._items.length;
    }
}
exports.Main = Main;
