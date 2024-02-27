<template>
    <div class="authentication">
        <header>
            <h1>Authentication Page</h1>
        </header>
            <form @submit.prevent="submitForm">
                <label for="user">Username:</label><br>
                <input v-model="userName"  id="user" type="text" placeholder="Username" required><br>
                <label for="pass">Password:</label><br>
                <input v-model="passWord" id="pass" type="text" placeholder="Password" required><br><br>
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
                userName: '',
                passWord: ''
            };
        },
        methods: {
            async submitForm() {
                console.log("Submit was clicked.");
                const url = location.origin;
                try {
                    const response = await axios.post(url+"/api/authentication/login", {
                        username: this.userName,
                        password: this.passWord,
                    },
                    {
                       timeout: 3000,
                    })
                    .then(response => {
                        console.log(response.data);
                    })
                    if (response !== null) { //figure out JWT token thing
                        this.$router.push('/');
                        console.log("Rerouting, hang on!")
                    } else {
                        location.reload();
                    }
                    } catch (err: any) {
                        if (err.code === 'ECONNABORTED') {
                        console.log('The request timed out.');
                        } else {
                        console.log(err);
                        }
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