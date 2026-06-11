import { Input } from "./input.js";
import { Sound } from "./audio.js";

export class Dialogue {
    constructor() {
        this.active = false
        this.pages = []
        this.pageIndex = 0
        this.charIndex = 0
        this.chartTimer = 0
        this.charsPerSecond = 40
        this.speakerName = ""
        this.choiceIndex = 0
        this.onFinish = null
        this.onChoice = null
    }
    start(speakerName, pages, onFinish = null, onChoice = null) {
        this.active = true
        this.speakerName = speakerName
        this.pages = pages
        this.pageIndex = 0
        this.charIndex = 0
        this.charTimer = 0
        this.choiceIndex = 0
        this.onFinish = onFinish
        this.onChoice = onChoice
    }
    get currentPage() { return this.pages[this.pageIndex] }
    get currentText() {
        const p = this.currentPage
        return typeof p === "object" && p.choices ? p.choices : null
    }
    get fullyTyped() { return this.charIndex >= this.currentText.length }

    update(dt) {
        if (!this.active) return;
        if (!this.fullyTyped) {
            this.charTimer += dt
            const charsToAdd = Math.floor(this.chartTimer * this.charsPerSecond)
            if (charsToAdd > 0) {
                this.charIndex = Math.min(this.currentText.length, this.charIndex + charsToAdd)
                Sound.play("text")
            }
        }
        const choices = this.currentChoices
        if (choices && this.fullyTyped) {
            if (Input.wasPressed("ArrowUp")) {
                this.choiceIndex = (this.choiceIndex - 1 + choices.length) % choices.length
                Sound.play('blip')
            }
            if (Input.wasPressed("ArrowDown")) {
                this.choiceIndex = (this.choiceIndex + 1 + choices.length) % choices.length
                Sound.play('blip')
            }
            if (Input.wasPressed("Space") || Input.wasPressed("Enter")) {
                if (!this.fullyTyped) {
                    this.charIndex = this.currentText.length
                } else if (choices) {
                    if (this.onChoice) this.onChoice(this.choiceIndex); this.finish()
                } else {
                    Sound.play('select')
                    this.nextPage();
                }
            }
        }
    }
    nextPage() {
        if (this.pageIndex < this.pages.length - 1) {
            this.pageIndex += 1
            this.charIndex = 0
            this.charTimer = 0
            this.choiceIndex = 0
        } else {
            this.finish()
        }
    }
    finish() {
        this.active = false;
        const cb = this.onFinish
        this.onFinish = null
        if (cb) cb()
    }
}