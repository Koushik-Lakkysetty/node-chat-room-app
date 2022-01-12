const socket = io()

socket.on('countUpdated', () => {
    console.log('count has been updated')
})