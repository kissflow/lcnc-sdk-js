import React from 'react'

import { System } from './lazy_remote/index.js'

const App = () => {
    return (
        <div>
            <h1>shibi</h1>
            <div>
                <System
                    componentName={'./datasheet'}
                    container={window.kfcomponents}
                />
            </div>
        </div>
    )
}

export default App
