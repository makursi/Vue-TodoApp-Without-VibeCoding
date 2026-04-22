<script setup lang="ts">
import { ref, computed, watch } from "vue";

//定义物品清单类型接口
interface Todo {
    id: number;
    content: string;
    completed: boolean;
}

//任务内容
const todo = ref("");

const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos")) || []);

const filterStatus = ref("all");
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

// 删除任务

function deleteTodo(id: number) {
    //重新赋值
    todos.value = todos.value.filter((todo) => {
        return todo.id !== id;
    });
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
//添加功能
// 筛选（全部 / 未完成 / 已完成）→ computed（计算属性）

const filteredTodos = computed(() => {
    switch (filterStatus.value) {
        case "active":
            return todos.value.filter((todo) => {
                return !todo.completed;
            });
        case "completed":
            return todos.value.filter((todo) => {
                return todo.completed;
            });
        default:
            return todos.value;
    }
});
// 统计未完成数量 → computed

const activeCount = computed(() => {
    return todos.value.filter((todo) => {
        return !todo.completed;
    }).length;
});
// 监听任务变化 → watch（监听）,本地进行存储, 刷新页面仍能保存

watch(
    todos,
    (val) => {
        localStorage.setItem("todos", JSON.stringify(val));
    },
    { deep: true }, //深度监听
);
</script>

<template>
    <div class="todoApp">
        <div>
            <h1>TodoList</h1>

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
                        <button @click="deleteTodo(todo.id)">删除任务</button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="filteredTodos">
            <div>
                <p>未完成的任务有:{{ activeCount }}</p>

                <div>
                    <button @click="filterStatus = 'all'">全部</button>
                    <button @click="filterStatus = 'active'">未完成</button>
                    <button @click="filterStatus = 'completed'">已完成</button>
                </div>
            </div>

            <div>
                <ul>
                    <li v-for="ftodo of filteredTodos" :key="ftodo.id">
                        <p>{{ ftodo.content }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.completed {
    text-decoration: line-through;
    color: #999;
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
