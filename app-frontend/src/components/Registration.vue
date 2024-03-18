<template>
    <div class="registration">
        <header>
            <h1>Registration Page</h1>
        </header>
        <form @submit.prevent="register">
            <label for="user">Username:</label><br>
            <input v-model="userName"  id="user" type="text" placeholder="Username" required><br>
            <label for="pass">Password:</label><br>
            <input v-model="passWord" id="pass" type="text" placeholder="Password" required><br><br>
            <button class="submit">Submit</button> <br><br>
            <p>{{ exceptionText }}</p>
        </form>
    </div>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { ref } from 'vue';
    export default {
        data() {
            return {
                userName: '',
                passWord: '',
                exceptionText: ref('')
            };
        },
        methods: {
            async register() {
                console.log("Submit was clicked. Registration in progress.");
                const url = location.origin;
                try {
                    const response = await axios.post(url+"/api/user/create", {
                        username: this.userName,
                        password: this.passWord,
                    },
                    {
                       timeout: 5000,
                    })
                    console.log(response);
                    if (response.data !== null) { //pull from database
                        this.$router.push('/authentication');
                        console.log("Rerouting to the login page!")
                    } else {
                        location.reload();
                    }
                    } catch (err: any) {
                        if (err.code === 'ECONNABORTED') {
                        console.log('The request timed out.');
                        } else {
                        this.exceptionText = `${err} (If error 409, an account with that name already exists!)`;
                        }
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

.registration {
    padding-left: 40%;
}

.submit {
    color: #000000;
}
</style>