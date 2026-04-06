import { toTitleCase } from './utils.js';

// Interface demonstrating TS features
interface UserProfile {
    firstName: string;
    lastName: string;
    role: string;
}

// Class demonstrating TS features
class UserGreeting {
    private user: UserProfile;

    constructor(user: UserProfile) {
        this.user = user;
    }

    public getGreeting(): string {
        const fullName = `${this.user.firstName} ${this.user.lastName}`;
        return `Welcome, ${toTitleCase(fullName)}! Role: ${this.user.role}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello World! Vanilla TS Starter Initialized.");

    const genericUser: UserProfile = {
        firstName: "john",
        lastName: "doe",
        role: "Developer"
    };

    const greeter = new UserGreeting(genericUser);
    
    const displayElement = document.getElementById('user-display');
    if (displayElement) {
        displayElement.textContent = greeter.getGreeting();
    }
});
