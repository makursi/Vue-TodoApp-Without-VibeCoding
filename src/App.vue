<script setup lang="ts">
import { ref } from "vue";

//定义物品清单类型接口
interface Todo {
    id: number;
    content: string;
    completed: boolean;
}

//任务内容
const todo = ref("");
const todos = ref<Todo[]>([]);

//添加任务

function addTodo() {
    const value = todo.value.trim();

    if (!value) return;

    todos.value.push({
        id: Date.now(),
        content: value,
        completed: false,
    });

    todo.value = "";
}

//切换任务状态

function handleChange(id: number) {
    //查找点击的todo
    // find 必须返回boolean 值
    const item = todos.value.find((todo) => {
        return todo.id === id;
    });

    if (item) {
        item.completed = !item.completed;
    }

    console.log(todos.value);
}
</script>

<template>
    <div class="todoApp">
        <div>
            <h1>Todolist</h1>

            <label>
                <input type="text" v-model="todo" />
                <button @click="addTodo()">添加任务</button>
            </label>
        </div>

        <div>
            <div>
                <h2>待办清单</h2>
                <ul>
                    <li v-for="todo in todos" :key="todo.id">
                        <span :class="{ completed: todo.completed }">{{
                            todo.content
                        }}</span>
                        <input
                            type="checkbox"
                            :checked="todo.completed"
                            @change="handleChange(todo.id)"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.completed {
    text-decoration: line-through;
}

.todoApp {
    width: 200px;
    height: 200px;
    margin: 100px auto;
    text-align: center;
}
button {
    margin-top: 10px;
}
</style>
