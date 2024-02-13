<template>
    <div class="authentication">
        <header>
            <h1>Authentication Page</h1>
        </header>
            <form @submit.prevent="submit">
                <label for="user">Username:</label><br>
                <input v-model="username" type="text" placeholder="Username" required><br>
                <label for="pass">Password:</label><br>
                <input v-model="password" type="text" placeholder="Password" required><br><br>
                <button class="submit">Submit</button>
            </form>
    </div>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                username: '',
                password: ''
            };
        },
        methods: {
            async submit() {
                const url = "location.origin";
                const response = await fetch(url+"api/users", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        username: this.username,
                        password: this.password,
                    }),
                });
                console.log("Username: " + {username: this.username} + " Password: " + {password: this.password});
            },
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