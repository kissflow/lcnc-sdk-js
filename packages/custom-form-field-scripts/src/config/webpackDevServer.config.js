export default {
    port: 9090,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    client: {
        overlay: false,
        logging: 'none',
    },
    onListening: (devServer) => {
        if (!devServer) {
            throw new Error('webpack-dev-server is not defined')
        }

        const port = devServer.server.address().port
        console.log('@kf-c3 listening on port: ', port)
    },
}
