<template>
    <div class="authentication">
        <header>
            <h1>Authentication Page</h1>
        </header>
            <form @submit.prevent="submitForm">
                <label for="user">Username:</label><br>
                <input v-model="username"  id="user" type="text" placeholder="Username" required><br>
                <label for="pass">Password:</label><br>
                <input v-model="password" id="pass" type="text" placeholder="Password" required><br><br>
                <button class="submit">Submit</button> <br><br>
            </form>
    </div>
    <div class="toRegistration">
        <form @submit.prevent="linkToRegister">
            <button class="register">Not Registered? Click Here!</button>
        </form>
    </div>
    </template>

<script lang="ts">
    import axios from 'axios';
    export default {
        data() {
            return {
                username: '',
                password: ''
            };
        },
        methods: {
            async submitForm() {
                console.log("Submit was clicked. Now awaiting a response");
                const url = location.origin;
                try {
                    axios.post(url+"/api/authentication/login", {
                        username: this.username,
                        password: this.password
                    },
                    {
                       timeout: 2000 
                    })
                    .then((response) => {
                        if (response.data !== null) {
                            this.$router.push('/');
                        } else {
                            location.reload();
                        }
                    });
                } catch(timeout) {
                    console.log("Timed out");
                }
            },
            async linkToRegister() {
                console.log("Registration was clicked. Rerouting to the Registration Page");
                try {
                    this.$router.push('/registration');
                } catch(error) {
                    console.error("Error switching to registration page", error);
                }
            },
        },
    };
</script>

<style scoped>
header {
    height: 70px;
    text-align: center;
}
.authentication {
    padding-left: 40%;
}
.toRegistration {
    padding-left: 40%;
}
</style>