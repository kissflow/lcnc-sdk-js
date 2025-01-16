const getNativeDynamicImport = () => {
    // eslint-disable-next-line no-eval
    return eval(`(url) => import(url)`)
}

export { getNativeDynamicImport }
