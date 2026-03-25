<script setup>
import { ElMessageBox } from "element-plus"
// 引入 Pinia 状态
import { useTodoStore } from '/src/stores/todo.js'
const todoStore = useTodoStore()
</script>

<template>
  <div class="todo-container">
    <div class="todo-card">
      <h2 class="todo-title">待办事项清单</h2>

      <!-- 输入区域 -->
      <div class="todo-input-wrapper">
        <input
            v-model="todoStore.newTodo"
            type="text"
            placeholder="添加新的待办事项..."
            class="todo-input"
            @keyup.enter="todoStore.addTodo"
        />
        <button class="todo-add-btn" @click="todoStore.addTodo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <!-- 统计信息 -->
      <div class="todo-stats">
        <span>总计: {{ todoStore.todos.length }} | 已完成: {{ todoStore.completedCount }} | 待完成: {{ todoStore.pendingCount }}</span>
        <button
            class="todo-batch-delete-btn"
            :disabled="todoStore.selectedTodos.length === 0"
            @click="todoStore.batchDelete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          批量删除
        </button>
      </div>

      <!-- 表格区域 -->
      <div class="todo-table-wrapper">
        <table class="todo-table">
          <thead>
          <tr>
            <th class="checkbox-col">
              <input
                  type="checkbox"
                  v-model="todoStore.selectAll"
              />
            </th>
            <th>名称</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>修改时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="todoStore.todos.length === 0">
            <td colspan="6" class="todo-empty">暂无待办事项，添加一个吧！</td>
          </tr>
          <tr v-for="todo in todoStore.todos" :key="todo.id">
            <td class="checkbox-col">
              <input
                  type="checkbox"
                  v-model="todoStore.selectedTodos"
                  :value="todo.id"
              />
            </td>
            <td>{{ todo.name }}</td>
            <td>
               <span class="todo-status"
                     :class="todo.status === 'completed' ? 'todo-status-completed' : 'todo-status-pending'">
    {{ todo.status === 'completed' ? '已完成' : '待完成' }}
  </span>
              <el-tooltip
                  :content="todo.status === 'completed' ? '标记为待完成' : '标记为已完成'"
                  placement="top"
              >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="todo-lock"
                    @click="todoStore.toggleTodoStatus(todo)"
                >
                  <g v-if="todo.status === 'pending'">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9 1"></path>
                  </g>
                  <g v-else>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </g>
                </svg>
              </el-tooltip>
            </td>
            <td class="todo-time1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   class="todo-time-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ todo.createTime }}
            </td>
            <td class="todo-time2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   class="todo-time-icon">
                <polyline points="14 2 18 6 6 18 2 22 14 2"></polyline>
              </svg>
              {{ todo.updateTime }}
            </td>
            <td class="todo-actions">
              <button class="todo-action-btn todo-edit-btn" @click="todoStore.openEditModal(todo)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="todo-action-btn todo-delete-btn"
                      @click="
                      ElMessageBox.confirm(
                        '确定要删除这个待办事项吗？此操作无法撤销。',
                        '确认删除',
                        {
                          confirmButtonText: '删除',
                          cancelButtonText: '取消',
                          type: 'warning',
                          customClass: 'delete-confirm-box',
                        }
                      ).then(() => {
                        todoStore.deleteTodo(todo.id)
                      }).catch(() => {})
                    ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <el-dialog
      v-model="todoStore.isEditModalVisible"
      title="编辑待办事项"
      width="500px"
      :close-on-click-modal="false"
  >
    <div style="margin-bottom:16px;">请修改待办名称：</div>
    <el-input
        v-model="todoStore.editTodoName"
        placeholder="请输入待办事项"
        @keyup.enter="todoStore.saveEditTodo"
    />
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="todoStore.cancelEditTodo">取消</el-button>
      <el-button type="primary" @click="todoStore.saveEditTodo">
        保存修改
      </el-button>
    </span>
    </template>
  </el-dialog>
</template>

<style scoped>
:global(html),
:global(body) {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.todo-container {
  box-sizing: border-box;
  height: 100vh;
  background-color: #e8f0fe;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.todo-card {
  width: 100%;
  max-width: 1100px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 28px;
  margin-top: 28px;
}

.todo-title {
  text-align: center;
  color: #4154f1;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.todo-input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.todo-input:focus {
  border-color: #4154f1;
}

.todo-add-btn {
  width: 36px;
  height: 36px;
  background-color: #4154f1;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.todo-add-btn:hover {
  background-color: #3341d1;
}

.todo-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.todo-batch-delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.todo-batch-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.todo-batch-delete-btn:not(:disabled):hover {
  border-color: #ef4444;
  color: #ef4444;
}

.todo-table-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  overflow-x: auto;
}

.todo-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
}

.todo-table th:nth-child(1),
.todo-table td:nth-child(1) {
  width: 20px;
}

.todo-table th:nth-child(2),
.todo-table td:nth-child(2) {
  width: auto;
  min-width: 150px;
}

.todo-table th:nth-child(3),
.todo-table td:nth-child(3) {
  width: 200px;
}

.todo-table th:nth-child(4),
.todo-table td:nth-child(4) {
  width: 200px;
}

.todo-table th:nth-child(5),
.todo-table td:nth-child(5) {
  width: 200px;
}

.todo-table th:nth-child(6),
.todo-table td:nth-child(6) {
  width: 100px;
}

.todo-table th,
.todo-table td {
  padding: 12px 14px;
  text-align: left;
  font-size: 14px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-table th {
  background-color: #f9fafb;
  font-weight: 500;
  color: #6b7280;
}

.todo-table tbody tr {
  border-top: 1px solid #e5e7eb;
}

.todo-table tbody tr:hover {
  background-color: #f9fafb;
}

.todo-table td:nth-child(2) {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.checkbox-col {
  width: 40px;
}

.todo-empty {
  text-align: center;
  color: #9ca3af;
  padding: 32px 0;
}

.todo-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  white-space: nowrap;
}

.todo-status-completed {
  background-color: #10b981;
  color: white;
}

.todo-status-pending {
  background-color: #f3f4f6;
  color: #6b7280;
}

.todo-lock {
  display: inline-block;
  vertical-align: middle;
  color: #6b7280;
  flex-shrink: 0;
}

.todo-time-icon {
  flex-shrink: 0;
}

.todo-actions {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.todo-action-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.todo-edit-btn:hover {
  border-color: #4154f1;
  color: #4154f1;
}

.todo-delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
</style>

<style>
.delete-confirm-box {
  --el-messagebox-title-color: #1f2937;
  --el-messagebox-content-color: #4b5563;
  --el-messagebox-width: 600px;
}

.delete-confirm-box .el-message-box__header {
  padding: 5px 24px 5px;
  border-bottom: 1px solid #e5e7eb;
}

.delete-confirm-box .el-message-box__title {
  font-size: 16px;
  font-weight: 600;
}

.delete-confirm-box .el-message-box__content {
  padding: 24px;
}

.delete-confirm-box .el-message-box__message {
  font-size: 14px;
  line-height: 1.6;
}

.delete-confirm-box .el-message-box__btns {
  padding: 0 14px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.delete-confirm-box .el-button--default {
  border-color: #d1d5db;
  color: #374151;
}

.delete-confirm-box .el-button--primary {
  background-color: #ef4444;
  border-color: #ef4444;
}
</style>