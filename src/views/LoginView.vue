<template>
    <div class="login-page">
        <!-- 登入容器 -->
        <div class="login-container">
            <div class="login-logo">
                <img src="../assets/ToGoLogo.png" alt="Logo">
            </div>
            <!-- 新增管理員登入標題 -->
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
export default {
    data() {
        return {
            commit: '登入',
            account: '',
            psw: '',
        }
    },
    beforeMount() {
        localStorage.removeItem('adminId');
    },
    methods: {
        adminLogin() {
            // 模擬的帳號和密碼
            const validAccount = 'togo';
            const validPsw = '123';

            if (this.account === validAccount && this.psw === validPsw) {
                localStorage.setItem('adminId', JSON.stringify({ status: 'active' }));
                this.$router.push({ name: 'AdminView' });
            } else {
                alert("帳號或密碼錯誤");
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/pages/_login.scss';
</style>
