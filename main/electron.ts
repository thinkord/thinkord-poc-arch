import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev'
import * as path from 'path';
import { FileChannel } from '../ipc/FileChannel'
import { TestChannel } from '../ipc/TestChannel'
import { IIpcChannel } from "../ipc/IIpcChannel";

class Main {
    private win: BrowserWindow

    public init(channel: IIpcChannel[]) {
        app.on('ready', this.createWindow)
        app.on('window-all-closed', this.onWindowAllClosed)
        app.on('activate', this.onActivate)
    }
    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
    private onActivate() {
        if (!this.win) {
            this.createWindow()
        }
    }

    private createWindow() {
        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                // enableRemoteModule: true,
                contextIsolation: true,
                preload: path.resolve(__dirname, 'preload.js')
            }
        });

        this.win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`)
        this.win.once('ready-to-show', () => {
            this.win.show()
        })
        this.win.on('closed', () => {
            this.win = null
        })
    }
}

(new Main()).init([
    new TestChannel('test'),
    new FileChannel('fileprocess')
])


