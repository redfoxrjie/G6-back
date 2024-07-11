<template>
    <div class="modal" v-if="visible" @click.self="closeModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">會員詳細資料</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <p><strong>會員ID：</strong> <span>{{ member.id }}</span></p>
                    <p><strong>姓名：</strong> <span>{{ member.name }}</span></p>
                    <p><strong>會員帳號：</strong> <span>{{ member.account }}</span></p>
                    <p><strong>連絡電話：</strong> <span>{{ member.phone }}</span></p>
                    <p><strong>電子信箱：</strong> <span>{{ member.email }}</span></p>
                    <p><strong>生日：</strong> <span>{{ member.birthday }}</span></p>
                    <p><strong>國家：</strong> <span>{{ member.country }}</span></p>
                    <p><strong>違規點數：</strong> <span>{{ member.point }}</span></p>
                    <p><strong>帳號啟用狀態：</strong> <span>{{ member.active ? '是' : '否' }}</span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        member: {
            type: Object,
            required: true
        },
        visible: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1050;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>