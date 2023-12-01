const generatedUserID = randomId(10);

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
    'event': 'userData',
    'login_status' : 'logged in',
    'userID' : generatedUserID,
});

window.dataLayer.push({
    'event': 'login',
    'userID': generatedUserID,
    'client type': 'vip',
    'loginMethod': 'email',
    'dimension1': 'vip',
    'metic1': 'logged in',
});
