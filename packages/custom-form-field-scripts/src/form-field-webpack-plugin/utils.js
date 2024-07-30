const isPlural = (number) => {
    if (number > 1) {
        return 's'
    } else {
        return ''
    }
}

export { isPlural }
