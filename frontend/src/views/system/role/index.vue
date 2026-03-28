<template>
  <div class="role">
    <el-card class="role-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索角色名称"
              size="small"
              style="width: 200px; margin-right: 10px"
              @keyup.enter="loadRoles"
            >
              <template #append>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" size="small" @click="openAddDialog">
              <el-icon><Plus /></el-icon>
              新增角色
            </el-button>
          </div>
        </div>
      </template>

      <!-- 角色列表 -->
      <el-table :data="roles" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="roleName" label="角色名称" width="120" />
        <el-table-column prop="roleCode" label="角色代码" width="120" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="updateRoleStatus(scope.row.id, scope.row.status)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewRoleDetail(scope.row)" circle>
              <el-icon><View /></el-icon>
            </el-button>
            <el-button type="success" size="small" @click="openEditDialog(scope.row)" circle>
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click="assignPermission(scope.row)" circle>
              <el-icon><Key /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteRole(scope.row.id)" circle>
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

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="isEditMode ? '编辑角色' : '新增角色'"
      width="50%"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="120px"
      >
        <el-form-item prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色代码" />
        </el-form-item>
        <el-form-item prop="description">
          <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item prop="status">
          <el-switch v-model="roleForm.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="60%"
      :height="600"
    >
      <div class="permission-container">
        <el-form :model="permissionForm">
          <el-form-item label="角色名称">
            <el-input v-model="permissionForm.roleName" disabled />
          </el-form-item>
          <el-form-item label="角色代码">
            <el-input v-model="permissionForm.roleCode" disabled />
          </el-form-item>
          <el-form-item label="权限列表">
            <el-tree
              v-model="permissionForm.permissions"
              :data="permissionTree"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              check-strictly
            >
              <template #default="{ node, data }">
                <span class="permission-node">
                  <el-icon v-if="data.type === 'menu'" style="margin-right: 5px"><Menu /></el-icon>
                  <el-icon v-else-if="data.type === 'button'" style="margin-right: 5px"><CircleCheck /></el-icon>
                  {{ node.label }}
                </span>
              </template>
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissionAssignment">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 角色详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="角色详情"
      width="50%"
    >
      <div v-if="currentRole" class="role-detail">
        <el-form :model="currentRole" label-width="120px">
          <el-form-item label="角色名称">
            <el-input v-model="currentRole.roleName" disabled />
          </el-form-item>
          <el-form-item label="角色代码">
            <el-input v-model="currentRole.roleCode" disabled />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="currentRole.description" type="textarea" disabled />
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="currentRole.status ? 'success' : 'danger'">
              {{ currentRole.status ? '启用' : '禁用' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="currentRole.createTime" disabled />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="currentRole.updateTime" disabled />
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
const roles = ref([])
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 权限树数据
const permissionTree = ref([
  {
    id: 1,
    label: '系统管理',
    type: 'menu',
    children: [
      {
        id: 2,
        label: '用户管理',
        type: 'menu',
        children: [
          { id: 3, label: '查看用户', type: 'button' },
          { id: 4, label: '新增用户', type: 'button' },
          { id: 5, label: '编辑用户', type: 'button' },
          { id: 6, label: '删除用户', type: 'button' },
          { id: 7, label: '分配角色', type: 'button' }
        ]
      },
      {
        id: 8,
        label: '角色管理',
        type: 'menu',
        children: [
          { id: 9, label: '查看角色', type: 'button' },
          { id: 10, label: '新增角色', type: 'button' },
          { id: 11, label: '编辑角色', type: 'button' },
          { id: 12, label: '删除角色', type: 'button' },
          { id: 13, label: '分配权限', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 14,
    label: '生产管理',
    type: 'menu',
    children: [
      {
        id: 15,
        label: '生产线管理',
        type: 'menu',
        children: [
          { id: 16, label: '查看生产线', type: 'button' },
          { id: 17, label: '新增生产线', type: 'button' },
          { id: 18, label: '编辑生产线', type: 'button' },
          { id: 19, label: '删除生产线', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 20,
    label: '模型管理',
    type: 'menu',
    children: [
      {
        id: 21,
        label: '模型列表',
        type: 'menu',
        children: [
          { id: 22, label: '查看模型', type: 'button' },
          { id: 23, label: '上传模型', type: 'button' },
          { id: 24, label: '删除模型', type: 'button' },
          { id: 25, label: '设为当前', type: 'button' },
          { id: 26, label: '解析元信息', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 27,
    label: '规则管理',
    type: 'menu',
    children: [
      {
        id: 28,
        label: '规则配置',
        type: 'menu',
        children: [
          { id: 29, label: '查看规则', type: 'button' },
          { id: 30, label: '新增规则', type: 'button' },
          { id: 31, label: '编辑规则', type: 'button' },
          { id: 32, label: '删除规则', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 33,
    label: '监控中心',
    type: 'menu',
    children: [
      {
        id: 34,
        label: '生产监控',
        type: 'menu',
        children: [
          { id: 35, label: '查看监控', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 36,
    label: '数据统计',
    type: 'menu',
    children: [
      {
        id: 37,
        label: '统计分析',
        type: 'menu',
        children: [
          { id: 38, label: '查看统计', type: 'button' }
        ]
      }
    ]
  },
  {
    id: 39,
    label: '报警管理',
    type: 'menu',
    children: [
      {
        id: 40,
        label: '报警列表',
        type: 'menu',
        children: [
          { id: 41, label: '查看报警', type: 'button' },
          { id: 42, label: '处理报警', type: 'button' },
          { id: 43, label: '忽略报警', type: 'button' },
          { id: 44, label: '删除报警', type: 'button' }
        ]
      }
    ]
  }
])

// 对话框状态
const roleDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEditMode = ref(false)
const currentRole = ref(null)

// 表单数据
const roleFormRef = ref(null)
const roleForm = reactive({
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
  status: true
})

const permissionForm = reactive({
  roleId: '',
  roleName: '',
  roleCode: '',
  permissions: []
})

// 表单验证规则
const roleRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色代码', trigger: 'blur' }]
}

// 加载角色列表
const loadRoles = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      roleName: searchQuery.value
    }
    // 模拟API调用
    // const data = await getRolePage(params)
    // roles.value = data.records || []
    // pageInfo.total = data.total || 0
    
    // 模拟数据
    roles.value = [
      {
        id: 1,
        roleName: '管理员',
        roleCode: 'ADMIN',
        description: '系统管理员，拥有所有权限',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        roleName: '技术人员',
        roleCode: 'TECHNICIAN',
        description: '技术人员，拥有技术相关权限',
        status: 1,
        createTime: '2024-01-02 00:00:00',
        updateTime: '2024-01-02 00:00:00'
      },
      {
        id: 3,
        roleName: '生产人员',
        roleCode: 'PRODUCTION',
        description: '生产人员，拥有生产相关权限',
        status: 1,
        createTime: '2024-01-03 00:00:00',
        updateTime: '2024-01-03 00:00:00'
      },
      {
        id: 4,
        roleName: '质检人员',
        roleCode: 'QUALITY',
        description: '质检人员，拥有质检相关权限',
        status: 0,
        createTime: '2024-01-04 00:00:00',
        updateTime: '2024-01-04 00:00:00'
      }
    ]
    pageInfo.total = roles.value.length
  } catch (error) {
    console.error('加载角色列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadRoles()
}

// 打开新增对话框
const openAddDialog = () => {
  isEditMode.value = false
  Object.assign(roleForm, {
    id: '',
    roleName: '',
    roleCode: '',
    description: '',
    status: true
  })
  roleDialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (role) => {
  isEditMode.value = true
  Object.assign(roleForm, {
    id: role.id,
    roleName: role.roleName,
    roleCode: role.roleCode,
    description: role.description,
    status: role.status
  })
  roleDialogVisible.value = true
}

// 保存角色
const saveRole = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 模拟API调用
      // if (isEditMode.value) {
      //   await updateRole(roleForm)
      // } else {
      //   await addRole(roleForm)
      // }
      
      // 更新本地数据
      if (isEditMode.value) {
        const index = roles.value.findIndex(item => item.id === roleForm.id)
        if (index !== -1) {
          roles.value[index] = { ...roles.value[index], ...roleForm, updateTime: new Date().toLocaleString() }
        }
      } else {
        const newRole = {
          id: roles.value.length + 1,
          ...roleForm,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        }
        roles.value.unshift(newRole)
      }
      
      roleDialogVisible.value = false
      loadRoles()
    } catch (error) {
      console.error('保存角色失败', error)
    }
  })
}

// 更新角色状态
const updateRoleStatus = async (roleId, status) => {
  try {
    // 模拟API调用
    // await updateRoleStatus(roleId, status)
    
    // 更新本地数据
    const index = roles.value.findIndex(item => item.id === roleId)
    if (index !== -1) {
      roles.value[index].status = status
      roles.value[index].updateTime = new Date().toLocaleString()
    }
  } catch (error) {
    console.error('更新角色状态失败', error)
  }
}

// 分配权限
const assignPermission = (role) => {
  Object.assign(permissionForm, {
    roleId: role.id,
    roleName: role.roleName,
    roleCode: role.roleCode,
    permissions: [] // 这里可以根据实际情况设置默认选中的权限
  })
  permissionDialogVisible.value = true
}

// 保存权限分配
const savePermissionAssignment = async () => {
  try {
    // 模拟API调用
    // await assignRolePermission(permissionForm.roleId, permissionForm.permissions)
    
    // 更新本地数据
    const index = roles.value.findIndex(item => item.id === permissionForm.roleId)
    if (index !== -1) {
      roles.value[index].updateTime = new Date().toLocaleString()
    }
    
    permissionDialogVisible.value = false
    loadRoles()
  } catch (error) {
    console.error('分配权限失败', error)
  }
}

// 查看角色详情
const viewRoleDetail = (role) => {
  currentRole.value = { ...role }
  detailDialogVisible.value = true
}

// 删除角色
const deleteRole = async (roleId) => {
  try {
    // 模拟API调用
    // await deleteRole(roleId)
    
    // 更新本地数据
    roles.value = roles.value.filter(item => item.id !== roleId)
    pageInfo.total = roles.value.length
    
    loadRoles()
  } catch (error) {
    console.error('删除角色失败', error)
  }
}

// 双击行编辑
const handleRowDoubleClick = (row) => {
  openEditDialog(row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadRoles()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped lang="scss">
.role {
  .role-card {
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

  .permission-container {
    max-height: 400px;
    overflow-y: auto;
  }

  .role-detail {
    .el-form-item {
      margin-bottom: 15px;
    }
  }

  .permission-node {
    display: flex;
    align-items: center;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>