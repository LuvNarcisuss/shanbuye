<template>
  <div class="user">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名或邮箱"
              size="small"
              style="width: 200px; margin-right: 10px"
              @keyup.enter="loadUsers"
            >
              <template #append>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="userStatus" placeholder="选择状态" size="small" @change="loadUsers">
              <el-option label="所有状态" value="" />
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
            <el-button type="primary" size="small" @click="openAddDialog">
              <el-icon><Plus /></el-icon>
              新增用户
            </el-button>
          </div>
        </div>
      </template>

      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="roleName" label="角色" width="120" />
        <el-table-column prop="deptName" label="部门" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="updateUserStatus(scope.row.id, scope.row.status)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewUserDetail(scope.row)" circle>
              <el-icon><View /></el-icon>
            </el-button>
            <el-button type="success" size="small" @click="openEditDialog(scope.row)" circle>
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click="assignRole(scope.row)" circle>
              <el-icon><User /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row.id)" circle>
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px">
        <el-pagination
          v-model:current-page="pageInfo.current"
          v-model:page-size="pageInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="isEditMode ? '编辑用户' : '新增用户'"
      width="50%"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" type="email" />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="password" v-if="!isEditMode">
          <el-input v-model="userForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item prop="deptId">
          <el-select v-model="userForm.deptId" placeholder="选择部门">
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-switch v-model="userForm.status" />
        </el-form-item>
        <el-form-item prop="remark">
          <el-input v-model="userForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="40%"
    >
      <el-form :model="roleForm">
        <el-form-item label="用户名">
          <el-input v-model="roleForm.username" disabled />
        </el-form-item>
        <el-form-item label="当前角色">
          <el-tag v-if="roleForm.currentRole">{{ roleForm.currentRole }}</el-tag>
          <el-tag v-else type="info">未分配</el-tag>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select v-model="roleForm.roleId" placeholder="选择角色">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRoleAssignment">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="50%"
    >
      <div v-if="currentUser" class="user-detail">
        <el-form :model="currentUser" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="currentUser.username" disabled />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="currentUser.name" disabled />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="currentUser.email" disabled />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="currentUser.phone" disabled />
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="currentUser.roleName" disabled />
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="currentUser.deptName" disabled />
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="currentUser.status ? 'success' : 'danger'">
              {{ currentUser.status ? '启用' : '禁用' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="currentUser.createTime" disabled />
          </el-form-item>
          <el-form-item label="最后登录">
            <el-input v-model="currentUser.lastLoginTime" disabled />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="currentUser.remark" type="textarea" disabled />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const searchQuery = ref('')
const userStatus = ref('')
const users = ref([])
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 部门和角色数据
const departments = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '生产部' },
  { id: 3, name: '质检部' },
  { id: 4, name: '行政部' }
])

const roles = ref([
  { id: 1, roleName: '管理员' },
  { id: 2, roleName: '技术人员' },
  { id: 3, roleName: '生产人员' },
  { id: 4, roleName: '质检人员' }
])

// 对话框状态
const userDialogVisible = ref(false)
const roleDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEditMode = ref(false)
const currentUser = ref(null)

// 表单数据
const userFormRef = ref(null)
const userForm = reactive({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  deptId: '',
  status: true,
  remark: ''
})

const roleForm = reactive({
  userId: '',
  username: '',
  currentRole: '',
  roleId: ''
})

// 表单验证规则
const userRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }]
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      username: searchQuery.value,
      status: userStatus.value
    }
    // 模拟API调用
    // const data = await getUserPage(params)
    // users.value = data.records || []
    // pageInfo.total = data.total || 0
    
    // 模拟数据
    users.value = [
      {
        id: 1,
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        roleName: '管理员',
        deptName: '技术部',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        lastLoginTime: '2024-01-01 10:00:00',
        remark: '系统管理员'
      },
      {
        id: 2,
        username: 'user1',
        name: '用户1',
        email: 'user1@example.com',
        phone: '13800138001',
        roleName: '技术人员',
        deptName: '技术部',
        status: 1,
        createTime: '2024-01-02 00:00:00',
        lastLoginTime: '2024-01-02 10:00:00',
        remark: '技术人员'
      },
      {
        id: 3,
        username: 'user2',
        name: '用户2',
        email: 'user2@example.com',
        phone: '13800138002',
        roleName: '生产人员',
        deptName: '生产部',
        status: 0,
        createTime: '2024-01-03 00:00:00',
        lastLoginTime: '2024-01-03 10:00:00',
        remark: '生产人员'
      }
    ]
    pageInfo.total = users.value.length
  } catch (error) {
    console.error('加载用户列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadUsers()
}

// 打开新增对话框
const openAddDialog = () => {
  isEditMode.value = false
  Object.assign(userForm, {
    id: '',
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    deptId: '',
    status: true,
    remark: ''
  })
  userDialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (user) => {
  isEditMode.value = true
  Object.assign(userForm, {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    deptId: user.deptId || '',
    status: user.status,
    remark: user.remark
  })
  userDialogVisible.value = true
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 模拟API调用
      // if (isEditMode.value) {
      //   await updateUser(userForm)
      // } else {
      //   await addUser(userForm)
      // }
      
      // 更新本地数据
      if (isEditMode.value) {
        const index = users.value.findIndex(item => item.id === userForm.id)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...userForm }
        }
      } else {
        const newUser = {
          id: users.value.length + 1,
          ...userForm,
          roleName: '技术人员',
          deptName: departments.value.find(d => d.id === userForm.deptId)?.name || '',
          createTime: new Date().toLocaleString(),
          lastLoginTime: ''
        }
        users.value.unshift(newUser)
      }
      
      userDialogVisible.value = false
      loadUsers()
    } catch (error) {
      console.error('保存用户失败', error)
    }
  })
}

// 更新用户状态
const updateUserStatus = async (userId, status) => {
  try {
    // 模拟API调用
    // await updateUserStatus(userId, status)
    
    // 更新本地数据
    const index = users.value.findIndex(item => item.id === userId)
    if (index !== -1) {
      users.value[index].status = status
    }
  } catch (error) {
    console.error('更新用户状态失败', error)
  }
}

// 分配角色
const assignRole = (user) => {
  Object.assign(roleForm, {
    userId: user.id,
    username: user.username,
    currentRole: user.roleName,
    roleId: ''
  })
  roleDialogVisible.value = true
}

// 保存角色分配
const saveRoleAssignment = async () => {
  try {
    // 模拟API调用
    // await assignUserRole(roleForm.userId, roleForm.roleId)
    
    // 更新本地数据
    const index = users.value.findIndex(item => item.id === roleForm.userId)
    if (index !== -1) {
      const role = roles.value.find(r => r.id === roleForm.roleId)
      users.value[index].roleName = role?.roleName || ''
    }
    
    roleDialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('分配角色失败', error)
  }
}

// 查看用户详情
const viewUserDetail = (user) => {
  currentUser.value = { ...user }
  detailDialogVisible.value = true
}

// 删除用户
const deleteUser = async (userId) => {
  try {
    // 模拟API调用
    // await deleteUser(userId)
    
    // 更新本地数据
    users.value = users.value.filter(item => item.id !== userId)
    pageInfo.total = users.value.length
    
    loadUsers()
  } catch (error) {
    console.error('删除用户失败', error)
  }
}

// 双击行编辑
const handleRowDoubleClick = (row) => {
  openEditDialog(row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadUsers()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped lang="scss">
.user {
  .user-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bold;

      .header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }
  }

  .user-detail {
    .el-form-item {
      margin-bottom: 15px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>