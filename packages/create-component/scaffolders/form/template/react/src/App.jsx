import { useEffect, useState } from 'react'
import { Form } from './form/index.jsx'

// The form's target is taken from the custom component's input parameters.
// The embedding Kissflow page must supply these parameter keys:
//   flowType, flowId, instanceId, viewId, activityInstanceId, title
//
// Reference values for local testing (bind these as input parameters):
//   dataform: flowType="dataform" flowId="Test_All_Fields_A00" instanceId="PkD_YlNlwWEB" title="Dynamic Form"
//   process:  flowType="process"  flowId="360_Degree_Feedback_new_A00" instanceId="PkDhEXpBupLm" activityInstanceId="PkDhzZnREAzL"

function App() {
    const [params, setParams] = useState({
        flowType: '',
        flowId: '',
        instanceId: '',
        viewId: '',
        activityInstanceId: '',
        title: 'Form',
    })

    useEffect(() => {
        const kf = window.kf // guaranteed by SDKWrapper before children render
        // React to input-parameter changes pushed by the embedding page.
        kf.context.watchParams((next) => setParams(next))
    }, [])

    if (!params) return null

    return (
        <div className="rootDiv">
            <Form
                // Remount so useForm re-inits cleanly when the target record changes.
                key={`${params.flowType}:${params.flowId}:${params.instanceId ?? ''}`}
                flowType={params.flowType}
                flowId={params.flowId}
                viewId={params.viewId}
                instanceId={params.instanceId}
                activityInstanceId={params.activityInstanceId}
                title={params.title}
            />
        </div>
    )
}

export default App
