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
                <button class="submit">Submit</button>
            </form>
        </div>
    </template>

<script lang="ts">
    import axios, { Axios } from 'axios';
    export default {
        data() {
            return {
                username: '',
                password: ''
            };
        },
        methods: {
            async submitForm() {
                console.log("Submit was clicked. Now awaiting a response")
                const url = location.origin;
                try {
                    const response = await axios.post(url+"/api/authentication/login", {
                        username: this.username,
                        password: this.password
                    });
                    console.log(response.status); // Handle response from Nest.js if needed
                    // console.log(response.request);
                    console.log(response.config.validateStatus?.toString);
                    // let token = response.data.data.token;
                    // localStorage.setItem("user", token);
                    

                    if (response.status === 200) {
                        this.$router.push('/');
                    } else if (response.status !== 200) {
                        
                        console.log("I am in the else");
                        this.$router.push('/authentication');
                    }
                } catch(error) {
                    console.error('Error signing in:', error);
                }
                // const response = await fetch(url+"api/users", {
                //     method: "POST",
                //     headers: {
                //     "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({ 
                //         username: this.username,
                //         password: this.password,
                //     }),
                // });

            },
            // redirect() {
            //    this.$router.push('/');
            // },
        },
    };
</script>

<style scoped>
header {
    height: 70px;
}
.user-pass {
    box-sizing: border-box;
}
.submitButton {
    color: #000000;
}
</style>