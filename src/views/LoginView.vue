<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-logo">
                <img src="../assets/ToGoLogo.png" alt="Logo">
            </div>
            <h2 class="login-title">管理員登入</h2>
            <form @submit.prevent="adminLogin" class="login-form">
                <div class="login-field">
                    <label for="account">帳號：</label>
                    <input type="text" v-model="account" id="account" name="memId">
                </div>
                <div class="login-field">
                    <label for="psw">密碼：</label>
                    <input type="password" v-model="psw" id="psw" name="memPsw">
                </div>
                <button type="submit" class="login-button">{{ commit }}</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            commit: '登入',
            account: '',
            psw: '',
        }
    },
    beforeMount() {
        localStorage.removeItem('adminInfo');
    },
    methods: {
        async adminLogin() {
            // console.log('Attempting login with:', this.account, this.psw);
            // const response = await axios.post('http://localhost/phpG6/api/admin.php?action=login', {
            //         username: this.account,
            //         password: this.psw
            //     }
            try {
                console.log('Attempting login with:', this.account, this.psw);
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/admin.php?action=login`,
            {
                username: this.account,
                password: this.psw
            }
                );
                console.log('Login response:', response.data);
                if (response.data.success) {
                    const adminInfo = response.data.admin;
                    console.log('Login successful, admin info:', adminInfo);
                    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                    this.$router.push({ name: 'AdminView' });
                } else {
                    console.error('Login failed:', response.data.message);
                    alert(response.data.message || "登入失敗");
                }
            } catch (error) {
                console.error('Login error:', error.response ? error.response.data : error.message);
                alert('登入失敗，請稍後再試');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/_login.scss';
</style>
