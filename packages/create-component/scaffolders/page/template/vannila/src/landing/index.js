function showUserInfo() {
    kf.client.showInfo(`Hi ${kf.user.Name}!`)
}

document.getElementById('error').style.display = 'none'

export function defaultLandingComponent() {
    let userName = window.kf.user.Name
    document.getElementById('error').style.display = 'none'
    document.getElementById('username').innerHTML = userName
    document
        .getElementById('clickHere')
        .addEventListener('click', () => showUserInfo())
}

export function defaultErrorComponent() {
    document.getElementById('landingHero').style.display = 'none'
}
