// src/stores/todo.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
    // 响应式数据
    const newTodo = ref('')
    const todos = ref([])
    const selectedTodos = ref([])
    let idCounter = 1

    // 编辑弹窗
    const isEditModalVisible = ref(false)
    const currentTodo = ref(null)
    const editTodoName = ref('')

    // 计算属性
    const completedCount = computed(() => todos.value.filter(t => t.status === 'completed').length)
    const pendingCount = computed(() => todos.value.filter(t => t.status === 'pending').length)
    const selectAll = computed({
        get: () => selectedTodos.value.length === todos.value.length && todos.value.length > 0,
        set: (val) => toggleSelectAll(val)
    })

    // 格式化时间
    const formatTime = (date) => {
        const pad = (n) => n.toString().padStart(2, '0')
        return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    // 改变状态
    const toggleTodoStatus = (todo) => {
        todo.status = todo.status === 'completed' ? 'pending' : 'completed'
        todo.updateTime = formatTime(new Date())
    }

    // 添加待办
    const addTodo = () => {
        if (!newTodo.value.trim()) return
        const now = new Date()
        const timeStr = formatTime(now)
        todos.value.push({
            id: idCounter++,
            name: newTodo.value.trim(),
            status: 'pending',
            createTime: timeStr,
            updateTime: timeStr
        })
        newTodo.value = ''
    }

    // 删除待办
    const deleteTodo = (id) => {
        todos.value = todos.value.filter(t => t.id !== id)
        selectedTodos.value = selectedTodos.value.filter(tId => tId !== id)
    }

    // 批量删除
    const batchDelete = () => {
        todos.value = todos.value.filter(t => !selectedTodos.value.includes(t.id))
        selectedTodos.value = []
    }

    // 打开编辑弹窗
    const openEditModal = (todo) => {
        currentTodo.value = todo
        editTodoName.value = todo.name
        isEditModalVisible.value = true
    }

    // 保存编辑
    const saveEditTodo = () => {
        if (!editTodoName.value.trim()) return
        currentTodo.value.name = editTodoName.value.trim()
        currentTodo.value.updateTime = formatTime(new Date())
        isEditModalVisible.value = false
    }

    // 取消编辑
    const cancelEditTodo = () => {
        isEditModalVisible.value = false
        currentTodo.value = null
        editTodoName.value = ''
    }

    // 全选/取消全选
    const toggleSelectAll = (val) => {
        if (val) {
            selectedTodos.value = todos.value.map(t => t.id)
        } else {
            selectedTodos.value = []
        }
    }

    return {
        newTodo,
        todos,
        selectedTodos,
        isEditModalVisible,
        currentTodo,
        editTodoName,
        completedCount,
        pendingCount,
        selectAll,
        toggleTodoStatus,
        formatTime,
        addTodo,
        deleteTodo,
        batchDelete,
        openEditModal,
        saveEditTodo,
        cancelEditTodo,
        toggleSelectAll
    }
}, {
    persist: true
})