<template>
    <div class="header_title">
        <h3>後台管理</h3>
        <div class="header_account">
            <div class="header_img">
                <img src="../assets/blackdogbrother.png" alt="Avatar">
            </div>
            <p>{{ name }}</p>
            <button @click="logout" class="logout-button">登出</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "黑狗兄",
        }
    },
    methods: {
        logout() {
            // 清除登錄信息並跳轉到登錄頁面
            localStorage.removeItem('adminId');
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.header_title {
    background-color: #4F82D4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px 0 300px;
    height: 80px; /* 設置標題區域的高度 */
}

.header_title h3 {
    color: rgb(255, 255, 255);
    font-size: 24px; /* 設置標題字體大小 */
    letter-spacing: 5px;
}

.header_account {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header_img {
    width: 40px;
    height: 40px;
}

.header_img img {
    width: 100%;
    height: 100%;
    border-radius: 50%; /* 圓形頭像 */
}

.header_account p {
    color: aliceblue;
    font-size: 24px;
    margin: 0;
}

.logout-button {
    background-color: #fff;
    color: #4F82D4;
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
