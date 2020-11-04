const baseURL = "http://localhost:3001/api";

//-----------------------AUTHENTICATION---------------------------

async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;
    }
}


//---------------------OFFICER ACCOUNT CREATION---------------------


async function login(user) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then((response) => {
            if (response.ok) {
                resolve(response.json());
            } else {
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}



const API = { isAuthenticated, login};

export default API;
