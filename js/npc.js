import { CONFIG } from './config.js'
import { SpriteAnimator } from './sprite.js'

export class NPC {
    constructor(data) {
        this.x = data.x
        this.y = data.y
        this.width = CONFIG.SCALED_TILE;
        this.height = CONFIG.SCALED_TILE;
        this.sprite = data.sprite || "cow"
        this.frames = data.frames || 8
        this.name = data.name || "Villager"
        this.dialogue = data.dialogue || ["..."]
        this.dialogueInProgress = data.dialogueInProgress || null
        this.dialogueComplete = data.dialogueComplete || null
        this.givesQuest = data.givesQuest || null
        this.anim = new SpriteAnimator()
        this.facing = data.facing !== undefined ? data.facing : 3
    }

    update(dt) {
        this.anim.update(dt, this.frames)
    }
    isNear(player) {
        const dx = (this.x + this.width / 2) - (player.x + player.width / 2)
        const dy = (this.y + this.height / 2) - (player.y + player.height / 2)
        return Math.hypot(dx, dy) < CONFIG.SCALED_TILE * 2.2
    }

    draw(ctx, camera) {
        const offset = (CONFIG.PLAYER_FRAME_SIZE * CONFIG.SCALE - this.width) / 2
        const screenX = this.x - offset - camera.x
        const screenY = this.y - (CONFIG.PLAYER_FRAME_SIZE * CONFIG.SCALE - this.height) + 6 - camera.y
        this.anim.draw(ctx, this.sprite, this.facing, screenX, screenY)
    }

}