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
    font-size: xx-large;
}
.authentication {
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 40%;
    margin-right: 40%;
    background-color: #282c32;
    border-radius: .3rem;
    border-color: rgb(0, 0, 0);
}
.toRegistration {
    border: solid;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
    max-width: 50rem;
    margin-left: 40%;
    margin-right: 40%;
    background-color: #282c32;
    border-radius: .3rem;
    color: #4680d1;;
    border-color: rgb(0, 0, 0);
}
.submit {
    border: solid;
    text-align: center;
    max-width: 50rem;
    margin-left: 25%;
    margin-right: 25%;
    background-color: #4680d1;
    border-radius: .3rem;
    border-width: .2cap;
}
.user, .pass {
    margin-top: 1rem;
    border: solid;
    border-width: .15rem;
    border-radius: .3rem;
    border-color: rgb(61, 139, 248);
    background-color: #282c32;
    color: rgb(255, 255, 255);
}
</style>