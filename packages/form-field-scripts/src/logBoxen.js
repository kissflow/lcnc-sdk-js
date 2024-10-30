const { default: boxen } = await import('boxen')

const logBoxenError = ({ title, description }) => {
    console.log(
        boxen(description, {
            title: title,
            margin: {
                bottom: 1,
            },
            fullscreen: false,
            padding: 1,
            borderStyle: 'double',
            backgroundColor: '#525050',
            borderColor: 'red',
        })
    )
}

const logBoxenWarning = ({ title, description }) => {
    console.log(
        boxen(description, {
            title: title,
            margin: {
                bottom: 1,
            },
            fullscreen: false,
            padding: 1,
            borderStyle: 'double',
            backgroundColor: '#525050',
            borderColor: 'yellow',
        })
    )
}

export { logBoxenError, logBoxenWarning }
