import { io } from 'socket.io-client'

class Socket {
    constructor(port) {
        this.socket = io(`http://localhost:${port}/`)

        // Retry connection upon disconnect
        this.socket.on('connect', () => {
            this.subscribeToCAN()
            console.log('connected')
        })
        this.socket.on('disconnect', () => {
            console.log('disconnected')
        })
    }

    subscribeToCAN() {
        this.socket.emit('subscribeToCAN')
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        this.socket.disconnect();
    }
}

export default Socket