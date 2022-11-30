import { PlayerRoot, ConfigWith, PlayerWith, FPEvent } from "@flowplayer/player";
import type { Plugin } from "@flowplayer/player/plugin"
import { CONFIG } from "@flowplayer/player/core/events"


// Plugin specific CSS
import "./snapshot-plugin.css"

type SnapshotPluginConfig = ConfigWith<{
  snapshot: {
    width: number
    height: number
  }
}>

type SnapshotEnabledPlayer = PlayerWith<{
  snapshot?: SnapshotPlugin
}>


export default class SnapshotPlugin implements Plugin {
  button?: HTMLButtonElement
  player?: SnapshotEnabledPlayer
  container?: PlayerRoot
  snapshotWidth: number
  snapshotHeight: number
  init(config: SnapshotPluginConfig, container: PlayerRoot, player: SnapshotEnabledPlayer) {
    this.player = player
    this.container = container
    
    this.render()

    this.player.snapshot = this // Expose API

    // Listen to configuration changes
    this.player.on<SnapshotPluginConfig>(CONFIG, ({ detail }) => {
      this.snapshotWidth = detail.snapshot.width
      this.snapshotHeight = detail.snapshot.height
    })
  }

  render() {
    if (this.button) this.button.parentElement?.removeChild(this.button)

    this.button = document.createElement("button")
    this.button.className = "snapshot-button"
    this.button.innerText = "Snapshot"
    this.container?.appendChild(this.button) 

    this.button.addEventListener("click", () => this.snapshot())
  }

  snapshot() {
    if (!this.player) return
    const canvas = document.createElement("canvas")
    canvas.height = this.snapshotHeight
    canvas.width = this.snapshotWidth

    const ctx = canvas.getContext("2d")
    ctx?.drawImage(this.player, 0, 0, canvas.width, canvas.height)

    this.player.emit("snapshot:image", canvas.toDataURL('image/png'))
  
  }
}