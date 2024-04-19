<template>
<main>
    <header>
        Authentication Page
    </header>
    <div class="authentication">
        <form @submit.prevent="submitForm">
            <input v-model="userName" class="user" id="user" type="text" placeholder="Username" required><br>
            <input v-model="passWord" class="pass" id="pass" type="password" placeholder="Password" required><br><br>
            <button class="submit">Submit</button> <br><br>

        </form>
    </div>
    <div class="toRegistration">
        <form @submit.prevent="linkToRegister">
            <button class="register">Not Registered? Click Here!</button>
        </form>
    </div>
</main>
</template>

<script lang="ts">
    import axios from 'axios';
    import NavigationHeader from '../components/NavigationHeader.vue';
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
                    if (response.data !== null) { //pull from database
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
    margin-bottom: 2rem;
    text-align: center;
    font-size: x-large;
}
.authentication {
    -ms-text-size-adjust: 2%;
    border-color: black;
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 30%;
    margin-right: 30%;
}
.toRegistration {
    border-color: black;
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 30%;
    margin-right: 30%;
}
.submit {
    border-color: black;
    border: solid;
    text-align: center;
    max-width: 50rem;
    margin-left: 30%;
    margin-right: 30%;
    background-color: darkcyan;
}
.user, .pass {
    margin-top: 1rem;
    border-color: black;
    border: solid;
    border-width: .15rem;
}
</style>