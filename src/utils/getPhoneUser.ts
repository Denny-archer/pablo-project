export function GetPhoneUser() {
        const phoneUser = localStorage.getItem('phoneUser');
        return phoneUser ? phoneUser : null;
    }