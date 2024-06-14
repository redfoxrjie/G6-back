<template>
    <label class="switch">
        <input type="checkbox" v-bind:checked="modelValue" @change="$emit('update:modelValue', !modelValue)">
        <span class="slider round"></span>
        <span v-if="modelValue" class="label">是</span>
        <span v-else class="label">否</span>
    </label>
</template>

<script>
export default {
    name: 'ToggleSwitch',
    props: {
        modelValue: Boolean
    }
}
</script>

<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background-color: #ccc; */
    transition: .4s;
    border-radius: 34px;
    border: 1px solid black ;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color:white;
}

input:checked + .slider:before {
    transform: translateX(26px);
    background-color: green;
}

input:not(:checked) + .slider:before {
    background-color: red;
}

.label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    font-weight: bold;
    color: #fff;
}

input:checked ~ .label {
    right: 10px;
}

input:not(:checked) ~ .label {
    left: 10px;
}
</style>
