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
$background-color: #F6F5F1;
$primary-color: #9FC3E7;
$secondary-color: #4F82D4;
$highlight-color: #F4DA7B;

.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: $background-color;

    .login-container {
        background-color: $primary-color;
        padding: 2rem;
        border-radius: 16px; // 調整邊框圓角
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        width: 350px; // 調整寬度
        max-width: 90vw; // 最大寬度設置，確保在小屏幕上也能正常顯示
        margin: auto; // 確保容器居中

        .login-logo {
            img {
                width: 80px; // 調整 logo 寬度
                height: auto;
                margin-bottom: 1rem;
            }
        }

        .login-title {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            color: $secondary-color;
        }

        .login-form {
            .login-field {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
                justify-content: space-between; // 確保左右對齊

                label {
                    flex: 0 0 50px; // 固定寬度
                    color: $secondary-color;
                    text-align: right; // 右對齊
                    margin-right: 0.5rem; // 添加右側間距
                }

                input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid $secondary-color;
                    border-radius: 4px;
                }
            }

            .login-button {
                padding: 0.5rem 1rem;
                background-color: $secondary-color;
                color: white;
                border: none;
                border-radius: 8px; // 調整邊框圓角
                cursor: pointer;

                &:hover {
                    background-color: $highlight-color;
                }
            }
        }
    }
}
</style>
